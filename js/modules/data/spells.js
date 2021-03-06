function spell(id) {
    return _spells[id];
}
function allStats(val) { return {str: val, agi: val, spi: val, int: val, sta: val} }
const rangedAbilities = [75, 27019, 27021, 34120];
const petAbilities = [1, 27050, 34027, 35298];
const abilityGroups = {
    1: [28507, 28499, 38929], // Potions
};
const _spells = {
    // Auto Attack
    1: {id: 1, melee: true, school: 'physical', weaponDamage: true},
    // Kill Command
    34027: {id: 34027, gcd: false, cd: 5000, castTime: 0, cost: 0, school: 'physical', melee: true, weaponDamage: true},
    // Gore
    35298: {id: 35298, gcd: true, cd:0, castTime:0, cost: 25, school: 'physical', icon: 'inv_weapon_shortblade_28', petFamily: ['ravager'], melee: true, minDamage: 37, maxDamage: 61},
    // Bite
    27050: {id: 27050, gcd: true, cd:10000, castTime:0, cost: 35, school: 'physical', icon: 'ability_racial_cannibalize', petFamily: ['ravager'], melee: true, minDamage: 108, maxDamage: 132}, 
    // Auto Shot
    75: {id: 75, ranged: true, school: 'physical', weaponDamage: true},
    // Arcane Shot
    27019: {id: 27019, gcd: true, cd: 6000, castTime: 0, cost: 230, school: 'arcane', ranged: true},
    // Multi-shot
    27021: {id: 27021, gcd: true, cd: 10000, castTime: 500, cost: 275, school: 'physical', ranged: true, weaponDamage: true}, 
    // Steady Shot
    34120: {id: 34120, gcd: true, cd: 0, castTime: 1000, cost: 110, school: 'physical', ranged: true, weaponDamage: true},
    // Foods
    33288: {id: 33288, uniqueType: 'food', icon: 'inv_misc_food_65', data: {agi: 20}, food: true},
    43765: {id: 43765, uniqueType: 'food', icon: 'inv_misc_food_84_roastclefthoof', data: {hitr: 20}, food: true},
    33284: {id: 33284, uniqueType: 'food', icon: 'inv_misc_food_53', data: {ap: 40, spi: 20}, food: true},
    // Pet Foods
    43772: {id: 43772, uniqueType: 'pet_food', icon: 'inv_misc_food_49', data: {str: 20, spi: 20}, petbuff: true},
    // Scrolls
    33077: {id: 33077, uniqueType: 'agi_scroll', icon: 'spell_holy_blessingofagility', data: {agi: 20}, petbuff: true, scroll: true},
    33082: {id: 33082, uniqueType: 'str_scroll', icon: 'spell_nature_strength', data: {str: 20}, scroll: true, petbuff: true},
    // Drums
    35476: {id: 35476, uniqueType: 'drums', icon: 'inv_misc_drum_02', auraId:35476, type:'buff', duration: 30000, mods: {hstr: 80}, drums:true},
    35475: {id: 35475, uniqueType: 'drums', icon: 'inv_misc_drum_03', auraId:35475, type:'buff', duration: 30000, mods: {ap: 60}, drums:true},
    // Debuffs
    27165: {id: 27165, icon: 'spell_holy_righteousnessaura', auraId: 27165, type: 'debuff', cd: 0, duration: 20000, school: 'holy', mods: {amph: 74}}, // wisdom debuff
    27159: {id: 27159, icon: 'spell_holy_holysmite', type: 'debuff', cd: 0, auraId: 27159, duration: 20000, school: 'holy', mods: {acrit: 0.03}}, // crusader
    26866: {id: 26866, icon: 'ability_warrior_riposte', auraId: 26866, type: 'debuff', cd: 0, duration: 30000, school: 'physical', mods: {armor: -2050*1.5}}, // expose armor
    34501: {id: 34501, icon: 'ability_rogue_findweakness', auraId:34501, type: 'debuff', cd: 0, duration: 7000, school: 'physical', mods: {aap: 275}}, // expose weakness
    29859: {id: 29859, icon: 'ability_warrior_bloodfrenzy', auraId: 29859, type: 'debuff', cd: 0, duration: 12000, school: 'physical', mods: {amoddmg: 0.04}}, // blood frenzy
    26993: {id: 26993, icon: 'spell_nature_faeriefire', auraId: 26993, type: 'debuff', cd: 0, duration: 40000, school: 'nature', mods: {ahit: 0.03, armor: -610}}, // ff
    14325: {id: 14325, icon: 'ability_hunter_snipershot', auraId: 14325, type: 'debuff', cd: 0, duration: 120000, school: 'arcane', mods: {aap: 440}}, // mark
    27226: {id: 27226, icon: 'spell_shadow_unholystrength', auraId: 27226, type: 'debuff', cd: 0, duration: 120000, school: 'shadow', mods: {armor: -800}}, // reck
    // Totems
    25528: {id: 25528, uniqueType: 'earth_totem', icon: 'spell_nature_earthbindtotem', auraId: 25528, type:'buff', duration: 120000, mods: {str: 98}, totem: true},
    25359: {id: 25359, uniqueType: 'wind_totem', icon: 'spell_nature_invisibilitytotem', auraId: 25359, type:'buff', duration: 120000, mods: {agi: 88}, totem: true},
    25570: {id: 25570, uniqueType: 'water_totem', icon: 'spell_nature_manaregentotem', auraId: 25570, type:'buff', duration: 120000, mods: {mps: 50}, totem: true},
    30811: {id: 30811, uniqueType: 'unleashed_rage', icon: 'spell_nature_unleashedrage', auraId: 30811, duration: 10000, type:'buff', mods: {modmap: 0.1}, shaman: true},
    // Buffs
    25898: {id:25898, uniqueType: 'blessing_of_kings', icon: 'spell_magic_greaterblessingofkings', data: {modagi: 0.1, modstr: 0.1, modint: 0.1, modsta: 0.1, modspi: 0.1}, buff: true},
    27044: {id: 27044, auraId: 27044, mods: {rap: 155}, type:'buff', cost: 140},
    27141: {id:27141, uniqueType: 'blessing_of_might', icon: 'spell_holy_greaterblessingofkings', data: {ap: 264}, buff: true},
    27143: {id:27143, uniqueType: 'blessing_of_wisdom', icon: 'spell_holy_greaterblessingofwisdom', data: {mps: 49}, buff: true},
    2048: {id: 2048, uniqueType: 'battle_shout', icon: 'ability_warrior_battleshout', data: {map: 381}, buff: true},
    27066: {id: 27066, uniqueType: 'trueshot_aura', icon: 'ability_trueshot', data: {ap: 125}, buff: true},
    24932: {id: 24932, uniqueType: 'lotp', icon: 'spell_nature_unyeildingstamina', data: {crit: 0.05}, buff: true},
    26991: {id: 26991, uniqueType: 'gotw', icon: 'spell_nature_giftofthewild', data: allStats(18), buff: true},
    27127: {id: 27127, uniqueType: 'arcane_brilliance', icon: 'spell_holy_arcaneintellect', data: {int: 40}, buff: true},
    25392: {id: 25392, uniqueType: 'fortitude', icon: 'spell_holy_prayeroffortitude', auraId: 25392, type:'buff', data: {sta: 102}, buff: true},
    34460: {id: 34460, uniqueType: '1', icon: 'ability_hunter_ferociousinspiration', type:'buff', mods: {moddmg:0.03}},
    37483: {id: 37483, type:'buff', duration: 15000, mods: {arp: 600}},
    2825: {id: 2825, uniqueType: '1', icon: 'spell_nature_bloodlust', auraId: 2825, type:'buff', duration:40000, mods: {modhst:0.3}},
    19624: {id: 19624, cd: 0, duration:8000, type: 'buff', mods: {modhst: 0.3}}, // Frenzy
    34471: {id: 34471, cd: 0, duration:18000, type: 'buff', mods: {moddmg: 0.1, scr: 0.2}}, // TBW
    34954: {id: 34954, cd: 0, duration:0, type: 'energize', mods: {focus: 0}}, // GftT
    34839: {id: 34839, duration: 8000, type: 'buff', mods: {crit: 0}}, // Master Tac
    34499: {id: 34499, cd: 0, duration: 0, type: 'energize', mods: {mana: 0}}, // Thrill
    46939: {id: 46939, cd: 0, duration: 0, type: 'energize', mods: {mana: 8}}, // Black Bow
    25076: {id: 25076, type: 'buff', mods: {modhst: 0.3, moddmg: -0.15}, icon: 'spell_nature_guardianward', petFamily: ['ravager']}, // Cobra Reflexes
    28553: {id: 28553, uniqueType: 'battle', icon: 'inv_potion_127', data: {agi: 35, rcritr: 20, mcritr: 20}, battleElixir: true},
    17538: {id: 17538, uniqueType: 'battle', icon: 'inv_potion_32', data: {agi: 25, rcritr: 28, mcritr: 28}, battleElixir: true},
    11467: {id: 11467, uniqueType: 'battle', icon: 'inv_potion_94', data: {agi: 25}, battleElixir: true},
    28520: {id: 28520, uniqueType: 'battle', icon: 'inv_potion_117', data: {rap: 120, map: 120}, battleElixir: true},
    28570: {id: 28570, uniqueType: 'guardian', icon: 'inv_potion_151', data: {mps: 16}, guardianElixir: true},
    28421: {id: 28421, uniqueType: 'stone', icon: 'inv_stone_weightstone_07', data: {bdmg: 12, rcritr: 14, mcritr: 14}, stone:true},
    23529: {id: 23529, uniqueType: 'stone', icon: 'inv_stone_weightstone_07', data: {bdmg: 12, mcritr: 14}, stone:true},
    29192: {id: 29192, data: {rap: 34, rhitr: 16, map: 34, mhitr: 16}, enchId:3003, slots:[1]}, // Cenarion Head
    28888: {id: 28888, data: {rap: 30, rcritr: 10, map: 30, mcritr: 10}, enchId:2986, slots:[3]}, // Aldor shoulder
    28910: {id: 28910, data: {rap: 15, rcritr: 20, map: 15, mcritr: 20}, enchId:2997, slots:[3]}, // Scryer shoulder
    27960: {id: 27960, data: {sta: 6, str:6, int:6, agi:6, spi:6}, enchId:2661, slots: [5]}, // 6 stats to chest
    34002: {id: 34002, data: {map: 24, rap: 24}, enchId:1593, slots: [9]}, // ap to bracer
    23800: {id: 23800, data: {agi: 15}, enchId:2564, slots: [16, 17]}, // agi to main hand
    42620: {id: 42620, data: {agi: 20}, enchId:3222, slots: [16, 17]}, // agi to main hand
    25080: {id: 25080, data: {agi: 15}, enchId:2564, slots: [10]}, // agi to glove
    35490: {id: 35490, data: {rap: 50, rcritr:12, map: 50, mcritr:12}, enchId:3012, slots: [7]}, // Cobra legs
    35488: {id: 35488, data: {rap: 40, map: 40, rcritr: 10, mcritr:10}, enchId:3010, slots: [7]}, // Cheap Cobra legs
    27951: {id: 27951, data: {agi: 12}, enchId: 2657, slots: [8]}, // Boots
    34007: {id: 34007, data: {agi: 6}, enchId: 2939, slots: [8]}, // Boots
    27954: {id: 27954, data: {rhitr: 10, mhitr: 10}, enchId:2658, slots: [8]}, // Boots
    34004: {id: 34004, data: {agi: 12}, enchId:368, slots: [15]}, // Cloak
    30260: {id: 30260, data: {rcritr: 28}, enchId:2724, slots: [18]}, // Bow
    30252: {id: 30252, data: {rmindmg: 12, rmaxdmg: 12}, enchId:2723, slots: [18]}, // Bow
    22779: {id: 22779, data: {rhitr: 30}, enchId:2523, slots: [18]}, // Bow
    27977: {id: 27977, data: {agi: 35}, enchId:2670, slots: [16]}, // 2h
    6150: {id: 6150, type: 'buff', cd: 0, duration: 12000, school: 'physical', mods: {modrhst: 0.00}},
    19574: {id: 19574, gcd: false, cd: 120000, castTime: 0, cost: 325, school: 'physical', type: 'buff', auraId: 19574, mods: {moddmg: 0.5}, duration: 18000}, // Bestial Wrath
    20572: {id: 20572, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 20572, mods: {ap: 282}, duration: 15000}, // Blood Fury
    3045: {id: 3045, gcd: false, cd: 300000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 3045, mods: {modhst: 0.4}, duration: 15000}, // Rapid Fire
    28507: {id: 28507, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 28507, mods: {hstr: 400}, duration: 15000, potion: true, cdGroup: 1}, // Haste Potion
    28499: {id: 28499, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'energize', mods: {mana: 2400}, potion: true, cdGroup: 1}, // Mana Potion
    38929: {id: 38929, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 38929, mods: {mps: 667}, duration: 24000, potion: true, cdGroup: 1}, // Fel-mana Potion
    27869: {id: 27869, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'energize', mods: {mana: 667}, rune: true}, // Dark rune
    35166: {id: 35166, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 35166, mods: {ap: 278}, duration: 20000}, // Bloodlust Brooch
    51955: {id: 51955, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 51955, mods: {ap: 278}, duration: 20000}, // Brew
    26296: {id: 26296, gcd: false, cd: 180000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 26296, mods: {hstp: 0.1}, duration: 10000}, // Berserking
    34026: {id: 34026, gcd: false, cd: 5000, castTime: 0, cost: 75, school: 'physical', auraId: 100001}, // kill command
    42083: {id: 42083, duration: 10000, type:'buff', school: 'physical', mods: {ap: 340}}, // tsunami
    34774: {id: 34774, duration: 10000, type:'buff', school: 'physical', mods: {hstr: 325}}, // dst
    40475: {id: 40475, duration: 10000, type:'buff', school: 'physical', mods: {arp: 300}}, // dst
    33648: {id: 33648, duration: 10000, type:'buff', school: 'physical', mods: {ap: 300}}, // hourglass
    45354: {id: 45354, duration: 20000, type:'buff', school: 'physical', mods: {ap: 230}}, // shard of contempt
    45355: {id: 45355, duration: 20000, type:'buff', school: 'physical', mods: {apph: 44, maxap: 440}}, // naaru
    39438: {id: 39438, duration: 10000, type:'buff', school: 'physical', mods: {apph: 6, maxap: 120}}, // crusade
    33807: {id: 33807, cd: 120000, castTime: 0, duration: 10000, type:'buff', auraId: 33807, school: 'physical', mods: {hstr: 260}}, // abacus
    34106: {id: 34106, cd: 120000, castTime: 0, duration: 20000, type:'buff', auraId: 34106, school: 'physical', mods: {arp: 600}}, // icon
    43716: {id: 43716, cd: 120000, castTime: 0, duration: 20000, type:'buff', auraId: 43716, school: 'physical', mods: {ap: 360}}, // berserker's
    46784: {id: 46784, cd: 90000, castTime: 0, duration: 15000, type:'buff', auraId: 46784, school: 'physical', mods: {ap: 320}}, // panther
    40729: {id: 40729, cd: 120000, castTime: 0, duration: 20000, type:'buff', auraId: 40729, school: 'physical', mods: {agi: 150}}, // panther

    100001: {id: 100001, gcd: false, duration: 3000, castTime: 0, cost: 0, school: 'physical', type: 'buff', mods: {cankc: true}},
};

export {_spells as all, abilityGroups, spell, rangedAbilities, petAbilities};