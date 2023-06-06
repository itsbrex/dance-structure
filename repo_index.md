
Included files:
### index.js
```javascript
'use strict';
// file: index.js

const PARTS = {
  Intro:    { weight: 1  , even: true, spillRank: 4, balance: true  },
  Verse:    { weight: 4  , even: true, spillRank: 5, balance: true  },
  Build:    { weight: 2  , even: true, spillRank: 6, balance: true  },
  Drop:     { weight: 3  , even: true, spillRank: 7, balance: true  },
  Break:    { weight: 2.5, even: true, spillRank: 1, balance: false },
  Break_sm: { weight: 3  , even: true, spillRank: 2, balance: false },
  Break_lg: { weight: 1  , even: true, spillRank: 1, balance: false },
  Outro:    { weight: 1  , even: true, spillRank: 3, balance: true  },
};

PARTS.PreChorus = { weight: 1.5, even: true, spillRank: 2, balance: true };
PARTS.Bridge = { weight: 2, even: true, spillRank: 3, balance: true };


const rankedEntries = Object.entries(PARTS).sort((a, b) => {
  return a[1].spillRank - b[1].spillRank;
});

const suggestedStructure = (structure = [], beats, bpMeasure) => {
  if (!structure.length) return [];
  if (!beats || !bpMeasure) return structure;

  const weightSum = structure.reduce((accum, p) => accum + PARTS[p.part].weight, 0);
  const { out, spill } = structure.reduce(
    (obj, { part }) => {
      const weight = PARTS[part].weight;
      const rawVal = (beats * (weight / weightSum)) / bpMeasure;
      const remainder = PARTS[part].even ? rawVal % 2 : 0;
      const val = Math.floor(rawVal - remainder);

      obj.spill += rawVal - val;
      obj.out.push({ part, measures: val, beats: val * bpMeasure });

      return obj;
    },
    { out: [], spill: 0 },
  );

  let overflow = Math.floor(spill);
  const fade = Math.floor((spill - overflow) * bpMeasure);

  while (overflow > 0) {
    const byType = out.reduce((obj, partObj) => {
      obj[partObj.part] = obj[partObj.part] || [];
      obj[partObj.part].push(partObj);
      return obj;
    }, {});

    const assignMeasures = (part, addMeasures) => {
      part.measures += addMeasures;
      part.beats += addMeasures * bpMeasure;
      overflow -= addMeasures;
    };

    rankedEntries.slice().forEach(([key, { even, balance }]) => {
      const addMeasures = even ? 2 : 1;
      const typeParts = byType[key] || [];

      if (overflow < addMeasures) return;

      if (balance) {
        if (typeParts.length * addMeasures > overflow) return;
        while (typeParts.length) assignMeasures(typeParts.shift(), addMeasures);
        return;
      }

      const part = typeParts.shift();
      if (part) assignMeasures(part, addMeasures);
    });
  }

  if (fade) out.push({ part: 'Fade', beats: fade });

  return out;
};

module.exports = { suggestedStructure, partsDefinition: PARTS };

```

### cli.js
```javascript
#! /usr/bin/env node
'use strict';
// file: cli.js


const prompts = require('prompts');
const { suggestedStructure, partsDefinition: PARTS } = require('./index');

const END = Symbol('end');

const onState = (state) => {
  if (!state.aborted) return;
  process.stdout.write('\x1B[?25h');
  process.stdout.write('\n');
  process.exit(1);
};

const parseDuration = (input) => {
  let minutes, seconds;

  if (input.includes(':')) {
    [minutes, seconds] = input.split(':').map(Number);
  } else if (input.includes('m') && input.includes('s')) {
    [minutes, seconds] = input
      .split(/m|s/)
      .filter((v) => v)
      .map(Number);
  } else {
    const floatMinutes = parseFloat(input);
    minutes = Math.floor(floatMinutes);
    seconds = Math.round((floatMinutes - minutes) * 60);
  }

  return { minutes, seconds };
};

const main = async () => {
  const { durationInput, bpm, bpMeasure } = await prompts([
    {
      type: 'text',
      name: 'durationInput',
      message: 'How long should the song be (e.g., 4:30, 4m30s, or 4.5)?',
      onState,
      validate: (value) => /^(\d+[:m]\d+s?)|(\d+(\.\d+)?)$/.test(value) || 'Invalid format! Please input in one of the formats: 4:30, 4m30s, or 4.5',
    },
    {
      type: 'number',
      name: 'bpm',
      message: 'What is the BPM (beats per minute)?',
      onState,
    },
    {
      type: 'number',
      name: 'bpMeasure',
      message: 'How many beats are there per measure?',
      onState,
    },
  ]);

  const { minutes, seconds } = parseDuration(durationInput);
  const beats = ((minutes * 60 + seconds) * bpm) / 60;

  const structure = [];

  while (structure[structure.length - 1]?.part !== END) {
    const hasParts = structure.length;
    const prefix = hasParts ? 'Next' : 'First';
    const suffix = hasParts && ` [${structure.map((p) => p.part).join(', ')}]`;
    const message = `${prefix} song part${suffix || ''}`;
    const final = { title: '(done)', value: END };

    const choices = Object.keys(PARTS)
      .map((k) => {
        return { value: k, title: k };
      })
      .concat(final);

    const { part } = await prompts({
      type: 'select',
      name: 'part',
      initial: 0,
      message,
      choices,
      onState,
    });

    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);

    structure.push({ part });
  }

  structure.pop();

  suggestedStructure(structure, beats, bpMeasure).forEach((p) => {
    const barText = p.measures && ` ${p.measures} bars`;
    const append = [barText].filter((t) => t).join(',');
    console.log(`${p.part.padEnd(10)}:${append.padStart(9)}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

```

