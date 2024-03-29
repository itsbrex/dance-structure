#!/usr/bin/env node

// cli.js


const prompts = require('prompts');
const { suggestedStructure, partsDefinition: PARTS } = require('./index');

const END = Symbol('end');

// Handles state update event and aborts
const onStateUpdate = (state) => {
  if (state.aborted) {
    process.stdout.write('\x1B[?25h');
    process.stdout.write('\n');
    process.exit(1);
  }
};

// Parses input song duration to {minutes, seconds}
const parseDuration = (input) => {
  const regex = /^(\d+[:m]\d+s?)|(\d+(\.\d+)?)$/;
  if (regex.test(input)) {
    let minutes;
    let seconds;
    if (input.includes(':')) {
      [minutes, seconds] = input.split(':').map(Number);
    } else if (input.includes('m') && input.includes('s')) {
      [minutes, seconds] = input.split(/m|s/).filter(Boolean).map(Number);
    } else {
      const floatMinutes = parseFloat(input);
      minutes = Math.floor(floatMinutes);
      seconds = Math.round((floatMinutes - minutes) * 60);
    }
    return { minutes, seconds };
  }
};

// Entry point to the CLI application
const main = async () => {
  try {
    const { durationInput, bpm, bpMeasure } = await prompts([
      {
        type: 'text',
        name: 'durationInput',
        message: 'How long should the song be (e.g., 4:30, 4m30s, or 4.5)?',
        onState: onStateUpdate,
        validate: (value) => parseDuration(value) !== undefined || 'Invalid format! Please input in one of the formats: 4:30, 4m30s, or 4.5',
      },
      {
        type: 'number',
        name: 'bpm',
        message: 'What is the BPM (beats per minute)?',
        onState: onStateUpdate,
      },
      {
        type: 'number',
        name: 'bpMeasure',
        message: 'How many beats are there per measure?',
        onState: onStateUpdate,
      },
    ]);

    const { minutes, seconds } = parseDuration(durationInput);
    const beats = ((minutes * 60 + seconds) * bpm) / 60;

    const structure = [];

    while (structure.length === 0 || structure[structure.length - 1].part !== END) {
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
        onState: onStateUpdate,
      });

      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);

      structure.push({ part });
    }

    structure.pop();

    for (const p of suggestedStructure(structure, beats, bpMeasure)) {
      const barText = p.measures ? ` ${p.measures} bars` : '';
      console.log(`${p.part.padEnd(10)}:${barText.padStart(9)}`);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
