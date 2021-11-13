import {petAbilities, rangedAbilities} from './spells.js';

function proc(id) {
    return _procs[id];
}
function requirements(id) {
    return _procRequirements[id];
}
const _procs = [
    // Can KC
    {id: 34026, event: 'damage', triggerAbilityIds: rangedAbilities, targetId: 's', chance: 1, icd: 0, abilityId: 100001},
    // Improved hawk
    {id: 19556, event: 'cast', triggerAbilityIds: [75], targetId:'s', ppm: 2, icd: 0, abilityId: 6150},
    // Beast Within
    {id: 34692, event: 'cast', triggerAbilityIds: [19574], targetId:'s', chance:1, icd:0, abilityId: 34471},
    // Frenzy
    {id: 19625, event: 'damage', triggerAbilityIds: petAbilities, targetId: 'p', chancePerTalent: 0.2, icd: 0, abilityId: 19624, requiresCrit: true},
    // Go for the Throat
    {id: 34954, event: 'damage', triggerAbilityIds: petAbilities, targetId: 'p', chance: 1, icd: 0, abilityId: 34954, requiresCrit: true},
    // Master tactician
    {id: 34839, event: 'damage', triggerAbilityIds: rangedAbilities, targetId: 's', chance: 0.06, icd: 0, abilityId: 34839},
    // Thrill of the Hunt
    {id: 34499, event: 'damage', triggerAbilityIds:rangedAbilities, targetId: 's', chancePerTalent: 1/3, icd: 0, abilityId:34499},
    // DST
    {id: 28830, event: 'cast', triggerAbilityIds: rangedAbilities, targetId:'s', ppm:1.0, icd: 20000, abilityId:34774},
    // Hourglass
    {id: 28034, event: 'damage', triggerAbilityIds: rangedAbilities, targetId:'s', chance:0.1, icd: 50000, abilityId:33648},
    // Shard of contempt
    {id: 34472, event: 'damage', triggerAbilityIds: rangedAbilities, targetId:'s', chance:0.1, icd: 45000, abilityId:45354},
    // Blackened Naaru Sliver
    {id: 34427, event: 'damage', triggerAbilityIds: rangedAbilities, targetId:'s', chance:0.1, icd: 45000, abilityId:45355},
    // Crusade
    {id: 31856, event: 'damage', triggerAbilityIds: rangedAbilities, targetId:'s', chance:1, icd: 0, abilityId:39438},
    // Black bow
    {id: 32336, event: 'damage', triggerAbilityIds: rangedAbilities, targetId:'s', chance:1, icd: 0, abilityId:46939},
    // Tsunami
    {id: 30627, event: 'damage', requiresCrit: true, triggerAbilityIds: rangedAbilities, targetId:'s', chance:0.1, icd: 45000, abilityId:42083},
    // Beast Lord
    {id: 650, event: 'cast', triggerAbilityIds: [34026], targetId: 's', chance: 1, icd: 0, abilityId:37483},
    // Madness
    {id: 32505, event: 'cast', triggerAbilityIds: rangedAbilities, targetId:'s', ppm:1, icd: 10000, abilityId:40475},
];
const _procRequirements = {
    28830: {items: [28830], count: 1},
    31856: {items: [31856], count: 1},
    30627: {items: [30627], count: 1},
    28034: {items: [28034], count: 1},
    34472: {items: [34472], count: 1},
    34427: {items: [34427], count: 1},
    32336: {items: [32336], count: 1},
    32505: {items: [32505], count: 1},
    650: {items: [28228, 27474, 28275, 27874, 27801], count: 4},
    34026: {none: true},
    19556: {talent: 'improvedHawk'},
    34692: {talent: 'beastWithin'},
    19625: {talent: 'frenzy'},
    34954: {talent: 'goForTheThroat'},
    34839: {talent: 'masterTactician'},
    34499: {talent: 'thrillOfTheHunt'},
};

export {_procs as all, proc, requirements}