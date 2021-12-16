function decode(s) {
    var points = Array(64).fill(0);
    var idx = 0;
    var treeIdx = 1;
    var trees = [0, 21, 41]
    for (let c of s) {
        if (c === '-') {
            idx = trees[treeIdx];
            treeIdx++;
            continue;
        }
        points[idx] = Number(c);
        idx++;
    }
    return Object.fromEntries(Object.keys(_talents).map((k,i) => { return [k, points[i]]; }));
}

function spellId(k, points) {
    return _talentRanks[k][points];
}

const _talents = {
    improvedAspectoftheHawk: { name: 'Improved Aspect of the Hawk', procs: [2]},
    enduranceTraining: { name: 'Endurance Training'},
    focusedFire: { name: 'Focused Fire', mods: {moddmg: 0.01}},
    improvedApsectoftheMonkey: { name: 'Improved Aspeect of the Monkey'},
    thickHide: { name: 'Thick Hide'},
    improvedRevivePet: { name: 'Improved Revive Pet'},
    pathFinding: { name: 'Pathfinding'},
    bestialSwiftness: { name: 'Bestial Swiftness'},
    unleashedFury: { name: 'Unleashed Fury', mods: {petmoddmg: 0.04}},
    improvedMendPet: { name: 'Improved Mend'},
    ferocity: { name: 'Ferocity', mods: {petcrit: 0.02}},
    spiritBond: { name: 'Spirit Bond'},
    intimidation: { name: 'Intimidation'},
    bestialDiscipline: { name: 'Bestial Discipline', mods: {petfps: 25 * 0.5}}, // TODO
    animalHandler: { name: 'Animal Handler', mods: {pethit: 0.02}},
    frenzy: { name: 'Frenzy', procs: [3]},
    ferociousInspiration: { name: 'Ferocious Inspiration', procs: [4, 5]},
    bestialWrath: { name: 'Bestial Wrath', rules: [1]},
    catlikeReflexes: { name: 'Catlike Reflexes'},
    serpentsSwiftness: { name: "Serpent's Swiftness", mods: {petmodhst: 0.04, modhst: 0.04}},
    theBeastWithin: { name: 'The Beast Within', procs: [6]},
    improvedConcussiveShot: { name: 'Improved Concussive Shot'},
    lethalShots: { name: 'Lethal Shots', mods: {rcrit: 0.01}},
    improvedHuntersMark: {name: "Improved Hunter's Mark", mods:{}},
    efficiency: { name: 'Efficiency', mods: {}},
    gofortheThroat: { name: 'Go for the Throat', procs: [7]},
    improvedArcaneShot: { name: 'Improved Arcane Shot'},
    aimedShot: { name: 'Aimed Shot'},
    rapidKilling: { name: 'Rapid Killing'},
    improvedStings: { name: 'Improved Stings'},
    mortalShots: { name: 'Mortal Shots', mods: {modrcritd: 0.06}},
    concussiveBarrage: { name: 'Concussive Barrage'},
    scatterShot: { name: 'Scatter Shot'},
    barrage: { name: 'Barrage'},
    combatExperience: { name: 'Combat Experience', mods: {modint: 0.03, modagi: 0.01}},
    rangedWeaponSpecialization: { name: 'Ranged Weapon Specialization', mods: {modrdmg: 0.01}},
    carefulAim: { name: 'Careful Aim'},
    trueshotAura: { name: 'Trueshot Aura'},
    improvedBarrage: { name: 'Improved Barrage'},
    masterMarksman: { name: 'Master Marksman', mods: {modrap: 0.02}},
    silencingShot: { name: 'Silencing Shot'},
    monsterSlaying: { name: 'Monster Slaying'},
    humanoidSlaying: { name: 'Humanoid Slaying'},
    hawkEye: { name: 'Hawk Eye'},
    savageStrikes: { name: 'Savage Strikes'},
    entrapment: { name: 'Entrapment'},
    deflection: { name: 'Deflection'},
    improvedWingClip: { name: 'Improved Wing Clip'},
    cleverTraps: { name: 'Clever Traps'},
    survivalist: { name: 'Survivalist'},
    deterrence: { name: 'Deterrence'},
    trapMastery: { name: 'Trap Mastery'},
    surefooted: { name: 'Surefooted', mods: {hit: 0.01}},
    improvedFeignDeath: { name: 'Improved Feign Death', mods: {modap: 0.02}},
    survivalInstincts: { name: 'Survival Instincts'},
    killerInstinct: { name: 'Killer Instinct', mods: {crit: 0.01}},
    counterattack: { name: 'Counterattack'},
    resourcefulness: { name: 'Resourcefulness'},
    lightningReflexes: { name: 'Lightning Reflexes', mods: {modagi: 0.03}},
    thrilloftheHunt: { name: 'Thrill of the Hunt'},
    wyvernString: { name: 'Wyvern Sting'},
    exposeWeakness: { name: 'Expose Weakness'},
    masterTactician: { name: 'Master Tactician'},
    readiness: { name: 'Readiness'},
};
let _talentRanks = {
    humanoidSlaying: {
        1: 19151,
        2: 19152,
        3: 19153
    },
    savageStrikes: {
        1: 19159,
        2: 19160
    },
    lightningReflexes: {
        1: 19168,
        2: 19180,
        3: 19181,
        4: 24296,
        5: 24297
    },
    entrapment: {
        1: 19184,
        2: 19387,
        3: 19388
    },
    improvedWingClip: {
        1: 19228,
        2: 19232,
        3: 19233
    },
    cleverTraps: {
        1: 19239,
        2: 19245
    },
    survivalist: {
        1: 19255,
        2: 19256,
        3: 19257,
        4: 19258,
        5: 19259
    },
    deterrence: {
        1: 19263
    },
    improvedFeignDeath: {
        1: 19286,
        2: 19287
    },
    surefooted: {
        1: 19290,
        2: 19294,
        3: 24283
    },
    deflection: {
        1: 19295,
        2: 19297,
        3: 19298,
        4: 19301,
        5: 19300
    },
    counterattack: {
        1: 19306,
        2: 20909,
        3: 20910,
        4: 27067
    },
    killerInstinct: {
        1: 19370,
        2: 19371,
        3: 19373
    },
    trapMastery: {
        1: 19376,
        2: 19377
    },
    wyvernSting: {
        1: 19386,
        2: 24132,
        3: 24133,
        4: 27068
    },
    improvedConcussiveShot: {
        1: 19407,
        2: 19412,
        3: 19413,
        4: 19414,
        5: 19415
    },
    efficiency: {
        1: 19416,
        2: 19417,
        3: 19418,
        4: 19419,
        5: 19420
    },
    improvedHuntersMark: {
        1: 19421,
        2: 19422,
        3: 19423,
        4: 19424,
        5: 19425
    },
    lethalShots: {
        1: 19426,
        2: 19427,
        3: 19429,
        4: 19430,
        5: 19431
    },
    aimedShot: {
        1: 19434,
        2: 20900,
        3: 20901,
        4: 20902,
        5: 20903,
        6: 20904,
        7: 27065
    },
    improvedArcaneShot: {
        1: 19454,
        2: 19455,
        3: 19456,
        4: 19457,
        5: 19458
    },
    barrage: {
        1: 19461,
        2: 19462,
        3: 24691
    },
    improvedStings: {
        1: 19464,
        2: 19465,
        3: 19466,
        4: 19467,
        5: 19468
    },
    mortalShots: {
        1: 19485,
        2: 19487,
        3: 19488,
        4: 19489,
        5: 19490
    },
    hawkEye: {
        1: 19498,
        2: 19499,
        3: 19500
    },
    scatterShot: {
        1: 19503
    },
    trueshotAura: {
        1: 19506,
        2: 20905,
        3: 20906,
        4: 27066
    },
    rangedWeaponSpecialization: {
        1: 19507,
        2: 19508,
        3: 19509,
        4: 19510,
        5: 19511
    },
    improvedAspectoftheMonkey: {
        1: 19549,
        2: 19550,
        3: 19551
    },
    improvedAspectoftheHawk: {
        1: 19552,
        2: 19553,
        3: 19554,
        4: 19555,
        5: 19556
    },
    pathfinding: {
        1: 19559,
        2: 19560
    },
    improvedMendPet: {
        1: 19572,
        2: 19573
    },
    bestialWrath: {
        1: 19574
    },
    improvedRevivePet: {
        1: 24443,
        2: 19575
    },
    intimidation: {
        1: 19577
    },
    spiritBond: {
        1: 19578,
        2: 20895
    },
    enduranceTraining: {
        1: 19583,
        2: 19584,
        3: 19585,
        4: 19586,
        5: 19587
    },
    bestialDiscipline: {
        1: 19590,
        2: 19592
    },
    bestialSwiftness: {
        1: 19596
    },
    ferocity: {
        1: 19598,
        2: 19599,
        3: 19600,
        4: 19601,
        5: 19602
    },
    thickHide: {
        1: 19609,
        2: 19610,
        3: 19612
    },
    unleashedFury: {
        1: 19616,
        2: 19617,
        3: 19618,
        4: 19619,
        5: 19620
    },
    frenzy: {
        1: 19621,
        2: 19622,
        3: 19623,
        4: 19624,
        5: 19625
    },
    readiness: {
        1: 23989
    },
    monsterSlaying: {
        1: 24293,
        2: 24294,
        3: 24295
    },
    animalHandler: {
        1: 34453,
        2: 34454
    },
    ferociousInspiration: {
        1: 34455,
        2: 34459,
        3: 34460
    },
    catlikeReflexes: {
        1: 34462,
        2: 34464,
        3: 34465
    },
    serpentsSwiftness: {
        1: 34466,
        2: 34467,
        3: 34468,
        4: 34469,
        5: 34470
    },
    combatExperience: {
        1: 34475,
        2: 34476
    },
    carefulAim: {
        1: 34482,
        2: 34483,
        3: 34484
    },
    masterMarksman: {
        1: 34485,
        2: 34486,
        3: 34487,
        4: 34488,
        5: 34489
    },
    silencingShot: {
        1: 34490
    },
    resourcefulness: {
        1: 34491,
        2: 34492,
        3: 34493
    },
    survivalInstincts: {
        1: 34494,
        2: 34496
    },
    thrilloftheHunt: {
        1: 34497,
        2: 34498,
        3: 34499
    },
    exposeWeakness: {
        1: 34500,
        2: 34502,
        3: 34503
    },
    masterTactician: {
        1: 34506,
        2: 34507,
        3: 34508,
        4: 34838,
        5: 34839
    },
    theBeastWithin: {
        1: 34692
    },
    rapidKilling: {
        1: 34948,
        2: 34949
    },
    gofortheThroat: {
        1: 34950,
        2: 34954
    },
    focusedFire: {
        1: 35029,
        2: 35030
    },
    concussiveBarrage: {
        1: 35100,
        2: 35102,
        3: 35103
    },
    improvedBarrage: {
        1: 35104,
        2: 35110,
        3: 35111
    }
}
export {decode, spellId, _talents as all}
