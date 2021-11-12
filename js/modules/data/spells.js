function spell(id) {
    return _spells[id];
}
function allStats(val) { return {str: val, agi: val, spi: val, int: val, sta: val} }
const rangedAbilities = [75, 27019, 27021, 34120];
const petAbilities = [1, 27050, 34027, 35298];
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
    33872: {id: 33872, uniqueType: 'food', icon: 'inv_misc_food_84_roastclefthoof', data: {hitr: 20}, food: true},
    33284: {id: 33284, uniqueType: 'food', icon: 'inv_misc_food_53', data: {ap: 40, spi: 20}, food: true},
    80001: {id: 80001, uniqueType: 'food', icon: 'spell_misc_emotionsad', data: {}, food: true},
    // Pet Foods
    33874: {id: 33874, uniqueType: 'pet_food', icon: 'inv_misc_food_49', data: {str: 20, spi: 20}, petfood: true},
    80002: {id: 80002, uniqueType: 'pet_food', icon: 'spell_misc_emotionsad', data: {}, petfood: true},
    // Drums
    35476: {id: 35476, uniqueType: 'drums', icon: 'inv_misc_drum_02', auraId:35476, type:'buff', duration: 30000, mods: {hstr: 80}, drums:true},
    35475: {id: 35475, uniqueType: 'drums', icon: 'inv_misc_drum_03', auraId:35475, type:'buff', duration: 30000, mods: {ap: 60}, drums:true},
    80007: {id: 80007, uniqueType: 'drums', icon: 'spell_misc_emotionsad', data: {}, drums: true},
    // Debuffs
    27165: {id: 27165, icon: 'spell_holy_righteousnessaura', auraId: 27165, type: 'debuff', cd: 0, duration: 20000, school: 'holy', mods: {amph: 74}}, // wisdom debuff
    27159: {id: 27159, icon: 'spell_holy_holysmite', type: 'debuff', cd: 0, auraId: 27159, duration: 20000, school: 'holy', mods: {acrit: 0.03}}, // crusader
    26866: {id: 26866, icon: 'ability_warrior_riposte', auraId: 26866, type: 'debuff', cd: 0, duration: 30000, school: 'physical', mods: {armor: -2050*1.5}}, // expose armor
    34501: {id: 34501, icon: 'ability_rogue_findweakness', auraId:34501, type: 'debuff', cd: 0, duration: 7000, school: 'physical', mods: {aap: 275}}, // expose weakness
    12721: {id: 12721, icon: 'ability_warrior_bloodfrenzy', auraId: 12721, type: 'debuff', cd: 0, duration: 12000, school: 'physical', mods: {amoddmg: 0.04}}, // blood frenzy
    26993: {id: 26993, icon: 'spell_nature_faeriefire', auraId: 26993, type: 'debuff', cd: 0, duration: 40000, school: 'nature', mods: {ahit: 0.03, armor: -610}}, // ff
    14325: {id: 14325, icon: 'ability_hunter_snipershot', auraId: 14325, type: 'debuff', cd: 0, duration: 120000, school: 'arcane', mods: {aap: 440}}, // mark
    27226: {id: 27226, icon: 'spell_shadow_unholystrength', auraId: 27226, type: 'debuff', cd: 0, duration: 120000, school: 'shadow', mods: {armor: -800}}, // reck
    // Totems
    25528: {id: 25528, uniqueType: 'earth_totem', icon: 'spell_nature_earthbindtotem', auraId: 25528, type:'buff', duration: 120000, mods: {str: 98}, totem: true},
    25359: {id: 25359, uniqueType: 'wind_totem', icon: 'spell_nature_invisibilitytotem', auraId: 25359, type:'buff', duration: 120000, mods: {agi: 88}, totem: true},
    25570: {id: 25570, uniqueType: 'water_totem', icon: 'spell_nature_manaregentotem', auraId: 25570, type:'buff', duration: 120000, mods: {mps: 50}, totem: true},
    30811: {id: 30811, uniqueType: 'unleashed_rage', icon: 'spell_nature_unleashedrage', auraId: 30811, duration: 10000, type:'buff', mods: {modmap: 0.1}},
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
    33077: {id: 33077, uniqueType: 'agi_scroll', icon: 'spell_holy_blessingofagility', data: {agi: 20}, petscroll: true, scroll: true},
    33082: {id: 33082, uniqueType: 'str_scroll', icon: 'spell_nature_strength', data: {str: 20}, scroll: true, petscroll: true},
    34460: {id: 34460, uniqueType: '1', icon: 'ability_hunter_ferociousinspiration', type:'buff', mods: {moddmg:0.03}},
    37483: {id: 37483, type:'buff', duration: 15000, mods: {arp: 600}},
    2825: {id: 2825, uniqueType: '1', icon: 'spell_nature_bloodlust', auraId: 2825, type:'buff', duration:40000, mods: {modhst:0.3}},
    19624: {id: 19624, cd: 0, duration:8000, type: 'buff', mods: {modhst: 0.3}}, // Frenzy
    34471: {id: 34471, cd: 0, duration:18000, type: 'buff', mods: {moddmg: 0.1, scr: 0.2}}, // TBW
    34954: {id: 34954, cd: 0, duration:0, type: 'energize', mods: {focus: 0}}, // GftT
    34839: {id: 34839, duration: 8000, type: 'buff', mods: {crit: 0}}, // Master Tac
    34499: {id: 34499, cd: 0, duration: 0, type: 'energize', mods: {mana: 0}}, // Thrill
    25076: {id: 25076, type: 'buff', mods: {modhst: 0.3, moddmg: -0.15}, icon: 'spell_nature_guardianward', petFamily: ['ravager']}, // Cobra Reflexes
    80005: {id: 80005, uniqueType: 'battle', icon: 'spell_misc_emotionsad', data: {}, battleelixir: true},
    28553: {id: 28553, uniqueType: 'battle', icon: 'inv_potion_127', data: {agi: 35, critr: 20}, battleelixir: true},
    13452: {id: 13452, uniqueType: 'battle', icon: 'inv_potion_32', data: {agi: 25, critr: 28}, battleelixir: true},
    11467: {id: 11467, uniqueType: 'battle', icon: 'inv_potion_94', data: {agi: 25}, battleelixir: true},
    22854: {id: 22854, uniqueType: 'battle', icon: 'inv_potion_117', data: {ap: 120}, battleelixir: true},
    22840: {id: 22840, uniqueType: 'guardian', icon: 'inv_potion_151', data: {mps: 16}, guardianelixir: true},
    80006: {id: 80006, uniqueType: 'guardian', icon: 'spell_misc_emotionsad', data: {}, guardianelixir: true},
    28421: {id: 28421, uniqueType: 'stone', icon: 'inv_stone_weightstone_07', data: {bdmg: 12, critr: 14}, stone:true},
    90001: {id: 90001, data: {ap: 34, hitr: 16}}, // Cenarion Head
    90003: {id: 90003, data: {ap: 30, critr: 10}}, // Aldor shoulder
    90005: {id: 90005, data: {sta: 6, str:6, int:6, agi:6, spi:6}}, // 6 stats to chest
    90009: {id: 90009, data: {ap: 24}}, // ap to bracer
    90016: {id: 90016, data: {agi: 15}}, // agi to main hand
    90017: {id: 90017, data: {agi: 15}}, // agi to off hand
    90010: {id: 90010, data: {agi: 15}}, // agi to glove
    90007: {id: 90007, data: {ap: 50, critr:12}}, // Cobra legs
    90008: {id: 90008, data: {agi: 12}}, // Boots
    90015: {id: 90015, data: {agi: 12}}, // Cloak
    90018: {id: 90018, data: {rcritr: 28}}, // Bow
    6150: {id: 6150, type: 'buff', cd: 0, duration: 12000, school: 'physical', mods: {modrhst: 0.00}},
    19574: {id: 19574, gcd: false, cd: 120000, castTime: 0, cost: 325, school: 'physical', type: 'buff', auraId: 19574, mods: {moddmg: 0.5}, duration: 18000}, // Bestial Wrath
    20572: {id: 20572, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 20572, mods: {ap: 282}, duration: 15000}, // Blood Fury
    3045: {id: 3045, gcd: false, cd: 300000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 3045, mods: {modhst: 0.4}, duration: 15000}, // Rapid Fire
    28507: {id: 28507, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 28507, mods: {hstr: 400}, duration: 15000}, // Haste Potion
    35166: {id: 35166, gcd: false, cd: 120000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 35166, mods: {ap: 278}, duration: 20000}, // Bloodlust Brooch
    26296: {id: 26296, gcd: false, cd: 180000, castTime: 0, cost: 0, school: 'physical', type: 'buff', auraId: 26296, mods: {hstp: 0.1}, duration: 10000}, // Berserking
    34026: {id: 34026, gcd: false, cd: 5000, castTime: 0, cost: 75, school: 'physical', auraId: 100001}, // kill command
    42083: {id: 42083, duration: 10000, type:'buff', school: 'physical', mods: {ap: 340}}, // tsunami
    34774: {id: 34774, duration: 10000, type:'buff', school: 'physical', mods: {hstr: 325}}, // dst
    100001: {id: 100001, gcd: false, duration: 3000, castTime: 0, cost: 0, school: 'physical', type: 'buff', mods: {cankc: true}},
};

export {_spells as all, spell, rangedAbilities, petAbilities};