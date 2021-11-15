function requirements(id) {
    return _auraRequirements[id];
}

const _auras = [
    {id: 35030, abilityId: 34027, mods: {crit: 0.1}},
    {id: 37505, abilityId: 34120, mods: {crit: 0.05}},
    {id: 38392, abilityId: 34120, mods: {moddmg: 0.1}},
    {id: 38392, abilityId: 34120, mods: {moddmg: 0.1}},
    {id: 24691, abilityId: 27021, mods: {moddmg: 0.04}},
    {id: 35111, abilityId: 27021, mods: {crit: 0.04}},
];

const _auraRequirements = {
   37505: {items: [30139, 30140, 30141, 30142, 30143], count: 4},
   38392: {items: [31001, 31003, 31004, 31005, 31006, 34549, 34443, 34570], count: 4},
   35030: {talent: 'focusedFire'},
   24691: {talent: 'barrage'},
   35111: {talent: 'improvedBarrage'},
};

export {_auras as all, requirements}