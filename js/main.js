const g_sim_app = {
    getState: (key) => {
        let savedState = localStorage.getItem(key);
        if (!savedState) return null;
        let state = JSON.parse(savedState);
        return state;
    },
    saveState: (key, state) => {
        localStorage.setItem(key, JSON.stringify(state));
        return state;
    },
    defaultState: {
        fightDuration: 209,
        encodedTalents: '512002005250122431051-0505201205',
        randomSeed: 1,
        targetArmor: 7700,
        quiverHaste: 15,
        race: 'orc',
        petFamily: 'ravager',
        petAbilities: [35298, 25076],
        mhStone: 28421,
        ohStone: 28421,
        numLusts: 1,
        numFerocious: 2,
        drums: 80007,
        totems: [],
        debuffs: [], 
        passiveBuffs: [
            80001, // No food
            80005, // No Battle
            80006, // No Guardian
        ],
        petBuffs: [
            80002, // No pet food
        ],
        acvtiveBuffs: [],
        items: [
            33803, // Ammo 24 
            32474, // Head 1
            29381, // Neck 2
            30143, // Shoulder 3
            null,  // Shirt
            30139, // Chest 5
            30040, // Waist 6
            29995, // Leg 7
            29951, // Feet 8
            29966, // Wrist 9
            30140, // Hands 10 
            29298, // Finger 11 
            28791, // Finger 11 
            29383, // Trinket 12
            28830, // Trinket 12
            29382, // Back 16 
            27846, // Main-Hand 21 
            28315, // Off-Hand 22 
            28772, // Ranged 15
        ],
        gems: {
            1: [32409, 24055],
            3: [24028, 24028],
            5: [24055, 31868, 31868],
            6: [24055, 24055],
            8: [24028, 24028],
            9: [24067],
            16: [24055, 24028],
        },
        enchants: {
            1: 90001, //{ap: 34, hitr: 16}, // Cenarion Head
            3: 90003, //{ap: 30, critr: 10}, // Aldor shoulder
            5: 90005, //{sta: 6, str:6, int:6, agi:6, spi:6}, // 6 stats to chest
            9: 90009, //{ap: 24}, // ap to bracer
            16: 90016, //{agi: 15}, // agi to main hand
            17: 90017, //{agi: 15}, // agi to off hand
            10: 90010, //{agi: 15}, // agi to glove
            7: 90003, //{ap: 50, critr:12}, // Cobra legs
            8: 90008, //{agi: 12}, // Boots
            15: 90015, //{agi: 12}, // Cloak
            18: 90018, //{rcritr: 28} // Bow
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    let simSettings = g_sim_app.getState('lastused') || g_sim_app.defaultState;
    console.log(simSettings);
}, false);