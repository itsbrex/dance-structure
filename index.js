// prettier-ignore
const PARTS = {
  Intro:     { weight: 1,   even: true,  spillRank: 4, balance: false, color: 'Light Blue'   },
  Verse:     { weight: 4,   even: true,  spillRank: 5, balance: true,  color: 'Green'        },
  PreChorus: { weight: 2,   even: true,  spillRank: 2, balance: true,  color: 'Light Purple' },
  Chorus:    { weight: 4,   even: true,  spillRank: 3, balance: true,  color: 'Yellow'       },
  Bridge:    { weight: 3,   even: true,  spillRank: 1, balance: true,  color: 'Orange'       },
  Build:     { weight: 2,   even: true,  spillRank: 6, balance: true,  color: 'Red'          },
  Drop:      { weight: 3,   even: true,  spillRank: 7, balance: true,  color: 'Dark Blue'    },
  Breakdown: { weight: 2.5, even: true,  spillRank: 1, balance: false, color: 'Orange'       },
  Outro:     { weight: 1,   even: false, spillRank: 3, balance: false, color: 'Light Gray'   },
};


const rankedEntries = Object.entries(PARTS).sort((a, b) => {
  return a[1].spillRank - b[1].spillRank;
});

const suggestedStructure = (structure, beats, bpMeasure) => {
  if (!structure.length) {
    return [];
  }
  if (!beats || !bpMeasure) {
    return structure;
  }

  const weightSum = structure.reduce((accum, p) => accum + PARTS[p.part].weight, 0);
  const { out, spill } = structure.reduce(
    (obj, { part }) => {
      const {weight} = PARTS[part];
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

      if (overflow < addMeasures) {
        return;
      }

      if (balance) {
        if (typeParts.length * addMeasures > overflow) {
          return;
        }
        while (typeParts.length) {
            assignMeasures(typeParts.shift(), addMeasures);
        }
        return;
      }

      const part = typeParts.shift();
      if (part) {
        assignMeasures(part, addMeasures);
      }
    });
  }

  if (fade) {
    out.push({ part: 'Fade', beats: fade });
  }

  return out;
};

module.exports = { suggestedStructure, partsDefinition: PARTS };
