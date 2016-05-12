export default {
  conditions: {
    C1: { name: 'condition 1', runs: 1, keys: [ ['L5', 'R5'], ['L5', 'R5'] ] },
    C2: { name: 'condition 2', runs: 1, keys: [ ['L5', 'R5'], ['L9', 'R1'] ] },
    C3: { name: 'condition 3', runs: 1, keys: [ ['L5', 'R5'], ['L1', 'R9'] ] }

    /*
    C4: {
      name: 'condition 4', trials: 10, iti: 15,
      keys: [
        ['L 0.5',    'R 0.5'],
        ['STAY_0.9', 'SWITCH_0.1']
      ]
    }
    */
  },
  keys: {
    L1: { name: 'left', probability: 0.1 },
    L5: { name: 'left', probability: 0.5 },
    L9: { name: 'left', probability: 0.9 },
    R1: { name: 'right', probability: 0.1 },
    R5: { name: 'right', probability: 0.5 },
    R9: { name: 'right', probability: 0.9 },
    'STAY_0.1': { name: 'stay', probability: 0.1 },
    'STAY_0.9': { name: 'stay', probability: 0.9 },
    'SWITCH_0.1': { name: 'switch', probability: 0.1 },
    'SWITCH_0.9': { name: 'switch', probability: 0.9 }
  },
  settings: {
    startCondition: {
      type: 'random',
      from: ['C1', 'C3']
    }
  }
}

// condition has sessions has trials
// condition 2 is never run first (.5 .5)
// inter-trial-interval, random or stable
