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
const _talents = {
    improvedHawk: { name: 'Improved Aspect of the Hawk'},
    enduranceTraining: { name: 'Endurance Training'},
    focusedFire: { name: 'Focused Fire', mods: {moddmg: 0.01}},
    imporvedMonkey: { name: 'Improved Aspeect of the Monkey'},
    thickHide: { name: 'Thick Hide'},
    improvedRevive: { name: 'Improved Revive Pet'},
    pathFinding: { name: 'Pathfinding'},
    bestialSwiftness: { name: 'Bestial Swiftness'},
    unleashedFury: { name: 'Unleashed Fury', mods: {petmoddmg: 0.04}},
    improvedMend: { name: 'Improved Mend'},
    ferocity: { name: 'Ferocity', mods: {petcrit: 0.02}},
    spiritBond: { name: 'Spirit Bond'},
    intimidation: { name: 'Intimidation'},
    bestialDiscipline: { name: 'Bestial Discipline', mods: {petfps: 25 * 0.5}}, // TODO
    animalHandler: { name: 'Animal Handler', mods: {pethit: 0.02}},
    frenzy: { name: 'Frenzy'},
    ferociousInspiration: { name: 'Ferocious Inspiration'},
    bestialWrath: { name: 'Bestial Wrath'},
    catlikeReflexes: { name: 'Catlike Reflexes'},
    serpentsSwiftness: { name: "Serpent's Swiftness", mods: {petmodhst: 0.04, modhst: 0.04}},
    beastWithin: { name: 'The Beast Within'},
    improvedConcussive: { name: 'Improved Concussive Shot'},
    lethalShots: { name: 'Lethal Shots', mods: {rcrit: 0.01}},
    improvedMark: "Improved Hunter's Mark",
    efficiency: { name: 'Efficiency'},
    goForTheThroat: { name: 'Go for the Throat'},
    improvedArcane: { name: 'Improved Arcane Shot'},
    aimedShot: { name: 'Aimed Shot'},
    rapidKilling: { name: 'Rapid Killing'},
    improvedStings: { name: 'Improved Stings'},
    mortalShots: { name: 'Mortal Shots', mods: {modrcritd: 0.06}},
    concussiveBarrage: { name: 'Concussive Barrage'},
    scatterShot: { name: 'Scatter Shot'},
    barrage: { name: 'Barrage'},
    combatExperience: { name: 'Combat Experience', mods: {modint: 0.03, modagi: 0.01}},
    ragedWeaponSpec: { name: 'Ranged Weapon Specialization', mods: {modrdmg: 0.01}},
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
    improvedFeign: { name: 'Improved Feign Death', mods: {modap: 0.02}},
    survivalInstincts: { name: 'Survival Instincts'},
    killerInstinct: { name: 'Killer Instinct', mods: {crit: 0.01}},
    counterattack: { name: 'Counterattack'},
    resourcefulness: { name: 'Resourcefulness'},
    lightningReflexes: { name: 'Lightning Reflexes', mods: {modagi: 0.03}},
    thrillOfTheHunt: { name: 'Thrill of the Hunt'},
    wyvernString: { name: 'Wyvern Sting'},
    exposeWeakness: { name: 'Expose Weakness'},
    masterTactician: { name: 'Master Tactician'},
    readiness: { name: 'Readiness'},
};
// cobra reflexes{petmodhst: 0.3}
export {decode, _talents as all}