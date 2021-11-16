import * as Util from './util.js';
import * as UIPicker from './picker.js';
import * as Items from '../data/items.js';
import * as Races from '../data/races.js';
import * as Spells from '../data/spells.js';
import * as Talents from '../data/talents.js';
import * as Inputs from '../siminputs.js';

function foodBuffs(settings) {
    var foods = [];
    for (let food of Object.values(Spells.all).filter(s=>s.food)) {
        foods.push({
            id: food.id,
            url: Util.whUrl('spell', food.id),
            checked: settings.passiveBuffs.includes(food.id)
        });
    }
    return Util.radiobox(foods, 'foods', true);
}

function elixirs(settings, type) {
    var elixirs = [];
    for (let elixir of Object.values(Spells.all).filter(s=>s[type])) {
        elixirs.push({
            id: elixir.id,
            url: Util.whUrl('spell', elixir.id),
            checked: settings.passiveBuffs.includes(elixir.id)
        });
    }
    return Util.radiobox(elixirs, type, true);
}

function drums(settings) {
    var drums = [];
    for (let drum of Object.values(Spells.all).filter(s=>s.drums)) {
        drums.push({
            id: drum.id,
            url: Util.whUrl('spell', drum.id),
            cls: 'drum',
            checked: settings.drums == drum.id
        });
    }
    return Util.radiobox(drums, 'drums', true);
}

function addStones(selector, settings, hand) {
    var stones = [];
    for (let stone of Object.values(Spells.all).filter(s=>s.stone)) {
        stones.push({
            id: stone.id,
            url: Util.whUrl('item', stone.id),
            checked: settings[hand+'Stone'] == stone.id
        });
    }
    let legend = Util.t2e(`<legend>Stone (${hand})</legend>`)
    let elements = Util.radiobox(stones, hand+'stones', true);
    selector.replaceChildren(...legend);
    selector.append(...elements);
}

function addSpell(selector, id, cls, checked=false) {
    let spell = Spells.spell(id);
    let option = {id: spell.id, url: Util.whUrl('spell', spell.id), checked: checked, cls: cls};
    let elements = Util.checkbox([option]);
    selector.append(...elements);
}

function addSpells(selector, checkedIds, name, filter) {
    var spells = [];
    for (let spell of Object.values(Spells.all).filter(filter)) {
        spells.push({
            id: spell.id,
            url: Util.whUrl('spell', spell.id),
            checked: checkedIds.includes(spell.id)
        });
    }
    let legendElement = Util.t2e(`<legend>${name}</legend>`)
    let spellElements = Util.checkbox(spells);
    selector.replaceChildren(...legendElement);
    selector.append(...spellElements);
}

function spells(checkedIds, cls, filter) {
    var spells = [];
    for (let spell of Object.values(Spells.all).filter(filter)) {
        spells.push({
            id: spell.id,
            url: Util.whUrl('spell', spell.id),
            cls: cls,
            checked: checkedIds.includes(spell.id)
        });
    }
    return Util.checkbox(spells);
}

function addTalents(selector, encodedTalents) {
    let talents = Talents.decode(encodedTalents);
    //let whTalentLink = `<a href='https://tbc.wowhead.com/talent-calc/embed/hunter/${encodedTalents}'></a>`;
    var html = '<legend>Talents</legend>';
    for (let k in talents) {
        let points = talents[k];
        if (points < 1) continue;
        let id = Talents.spellId(k, points);
        let a = `<label>${points} <a href='${Util.whUrl('spell', id)}'></a></label>`;
        html += a;
    }
    selector.replaceChildren(...Util.t2e(html));
}

function colorForSocket(socketId) {
    switch(socketId) {
        case 1: return 'meta';
        case 2: return 'red';
        case 3: return 'yellow';
        case 4: return 'blue';
    }
}
function updateStats(selector, player, target) {
    let ap = Math.floor(player.rangedAp(target));
    let agi = Math.floor(player.agi(target));
    let crit = Math.floor(player.rangedCrit(target)*1000)/10;
    let hit = Math.floor(player.rangedHit(target)*1000)/10;
    let haste = Math.floor((player.rangedHaste()-1)*1000)/10;
    let html = `<div id='rap'>Ranged Ap<hr>${ap}</div>`;
    html += `<div id='agi'>Agility<hr>${agi}</div>`;
    html += `<div id='crt'>Ranged Crit<hr>${crit}%</div>`;
    html += `<div id='hit'>Ranged Hit<hr>${hit}%</div>`;
    html += `<div id='hit'>Ranged Haste<hr>${haste}%</div>`;
    selector.replaceChildren(...Util.t2e(html));
}

function updateItems(selector, itemIds, gemIds, enchantIds, dispatch=false) {
    var html = '<div class="itemgrid">';
    for (let invSlot in itemIds) {
        if (invSlot == 4) continue; // Shirt
        let slotItemId = itemIds[invSlot];
        if (!slotItemId) {
            html += `<div class='item' data-type=item data-slot=${invSlot}>None</div><div></div><span></span><span></span><span></span><span></span>`;
            continue;
        }
        let extras = {};
        let slotGemIds = gemIds[invSlot] || [];
        if (slotGemIds.length > 0) {
            extras['gems'] = slotGemIds;
        }
        let slotEnchantId = enchantIds[invSlot];
        if (slotEnchantId) {
            let info = Spells.spell(slotEnchantId);
            if (info && info.enchId) extras['ench'] = [info.enchId];
        }
        let itemUrl = Util.whUrl('item', slotItemId, extras);
        html += `<div class='item' data-id=${slotItemId} data-type=item data-slot=${invSlot}><a href=${itemUrl}></a></div>`;
        var gemSocketIndex = 0;
        html += `<div></div>`;
        let item = Items.item(slotItemId);
        while (gemSocketIndex < 3) {
            let socketInfo = item['socket'+(gemSocketIndex+1)];
            let color = socketInfo ? colorForSocket(socketInfo) : null;
            if (slotGemIds[gemSocketIndex] && socketInfo) {
                let gemId = slotGemIds[gemSocketIndex];
                let gemUrl = Util.whUrl('item', gemId);
                html += `<a class='gem' data-id=${gemId} data-slot=${invSlot} data-socket=${gemSocketIndex} data-color=${color} data-type=gem data-wh-rename-link='false' href=${gemUrl}></a>`;
            } else {
                if (color) {
                    html += `<div data-slot=${invSlot} data-socket=${gemSocketIndex} data-type=gem data-color=${color} class='empty${color}'></div>`;
                } else {
                    html += '<span></span>';
                }
            }
            gemSocketIndex++;
        }
        if (slotEnchantId) {
            let type = [1,3,6].includes(Number(invSlot)) ? 'item' : 'spell';
            let enchUrl = Util.whUrl(type, slotEnchantId);
            html += `<a class='enchant' data-id=${slotEnchantId} data-slot=${invSlot} data-type=enchant data-wh-rename-link='false' href=${enchUrl}></a></span>`;
        } else if ([1, 3, 5, 7, 8, 9, 10, 15, 16, 17, 18].includes(Number(invSlot))) {
            html += `<div data-slot=${invSlot} data-type=enchant class='emptygreen'></div>`;
        } else {
            html += `<span></span>`;
        }
    }
    html += '</div>';
    selector.replaceChildren(...Util.t2e(html));
    for (let el of selector.querySelectorAll('.item, .gem, .enchant, .emptyred, .emptyblue, .emptyyellow, .emptymeta, .emptygreen')) { el.onclick = UIPicker.show; }
    if (dispatch) selector.dispatchEvent(new Event('change', {bubbles: true}));
}

function update(document, settings) {
    // Individual Settings
    document.getElementById('fightDuration').value = settings.fightDuration;
    document.getElementById('randomSeed').value = settings.randomSeed;
    document.getElementById('targetArmor').value = settings.targetArmor;
    document.getElementById('targetType').value = settings.targetType;
    document.getElementById('petFamily').value = settings.petFamily;
    document.getElementById('encodedTalents').value = settings.encodedTalents;
    document.getElementById('quiverHaste').value = settings.quiverHaste;
    
    // race
    let racesSel = document.querySelector('#races');
    racesSel.replaceChildren(...Util.t2e('<legend>Race</legend>'));
    for (let race of Object.values(Races.all)) {
        var html = `<label class='btn'><input type='radio' data-id=${race.id} name='race'${race.id === settings.race ? ' checked' : ''}>`;
        html += `<a class='icon ${race.id}' href='https://tbc.wowhead.com/${race.id}'>${race.name}</a></label>`;
        racesSel.append(...Util.t2e(html));
    }
    
    // buffs
    addSpells(document.querySelector('#staticBuffs'), settings.passiveBuffs, 'Static Buffs', s=>s.buff);

    // Consumes
    let foods = foodBuffs(settings);
    let battleElixirs = elixirs(settings, 'battleElixir');
    let guardianElixirs = elixirs(settings, 'guardianElixir');
    let scrolls = spells(settings.passiveBuffs, 'scroll', s=>s.scroll);
    
    document.querySelector('#consumes').replaceChildren(...Util.t2e('<legend>Consumes</legend>'));
    document.querySelector('#consumes').append(...foods);
    document.querySelector('#consumes').append(...Util.t2e('<hr>'));
    document.querySelector('#consumes').append(...battleElixirs);
    document.querySelector('#consumes').append(...Util.t2e('<hr>'));
    document.querySelector('#consumes').append(...guardianElixirs);
    document.querySelector('#consumes').append(...Util.t2e('<hr>'));
    document.querySelector('#consumes').append(...scrolls);

    // Pet Consumes
    addSpells(document.querySelector('#petBuffs'), settings.petBuffs, 'Pet Buffs', s=>s.petbuff);

    // Pet Abilities
    addSpells(document.querySelector('#petAbilities'), settings.petAbilities, 'Pet Abilities', s=>s.petFamily && s.petFamily.includes(settings.petFamily));

    var n = 0
    var sel = document.querySelector('#activeBuffs');
    sel.replaceChildren(...Util.t2e('<legend>Active Buffs</legend>'))
    while (n < 4) {
        addSpell(sel, 2825, 'lust', n<settings.numLusts);
        n++;
    }
    document.querySelector('#activeBuffs').append(...Util.t2e('<hr>'));
    n = 0
    while (n < 4) {
        addSpell(sel, 34460, 'ferocious', n<settings.numFerocious)
        n++;
    }
    document.querySelector('#activeBuffs').append(...Util.t2e('<hr>'));
    // Shaman
    let totems = spells(settings.totems, 'totem', s=>s.shaman||s.totem);
    document.querySelector('#activeBuffs').append(...totems);
    document.querySelector('#activeBuffs').append(...Util.t2e('<hr>'));

    // Drums
    document.querySelector('#activeBuffs').append(...drums(settings));

    // Stones
    addStones(document.querySelector('#mhStones'), settings, 'mh');
    addStones(document.querySelector('#ohStones'), settings, 'oh');

    // Debuff
    addSpells(document.querySelector('#debuffs'), settings.debuffs, 'Debuffs', s=>s.type === 'debuff');

    // Talents
    addTalents(document.querySelector('#talents'), settings.encodedTalents);

    // Stats
    let inputs = Inputs.create(settings);
    updateStats(document.querySelector('#stats'), inputs.player, inputs.target);

    // Items
    updateItems(document.querySelector('#items'), settings.items, settings.gems, settings.enchants, true);
}

function getItems(document) {
    let items = Array.from(document.querySelectorAll('#items .item'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = Number(c.id); return p;
    }, Array(19));
    // Gems
    let gems = Array.from(document.querySelectorAll('#items .gem'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = p[Number(c.slot)] || [];
        p[Number(c.slot)].push(Number(c.id)); return p;
    }, {});
    // Enchants
    let enchants = Array.from(document.querySelectorAll('#items .enchant'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = Number(c.id); return p;
    }, {});

    return {items: items, gems: gems, enchants: enchants};
}

function get(document) {
    let settings = {};
    settings.petFamily = document.getElementById('petFamily').value;
    settings.fightDuration = Number(document.getElementById('fightDuration').value);
    settings.randomSeed = Number(document.getElementById('randomSeed').value);
    settings.targetArmor = Number(document.getElementById('targetArmor').value);
    settings.targetType = document.getElementById('targetType').value;
    settings.encodedTalents = document.getElementById('encodedTalents').value;
    settings.quiverHaste = Number(document.getElementById('quiverHaste').value);
    settings.race = document.querySelector('#races input:checked').dataset.id;
    let passive = Array.from(document.querySelectorAll('#staticBuffs input:checked'), n=>Number(n.dataset.id));
    let consumes = Array.from(document.querySelectorAll('#consumes input:checked'), n=>Number(n.dataset.id)).filter(n=>!isNaN(n));
    settings.passiveBuffs = passive.concat(consumes);
    settings.petBuffs = Array.from(document.querySelectorAll('#petBuffs input:checked'), n=>Number(n.dataset.id));
    settings.petAbilities = Array.from(document.querySelectorAll('#petAbilities input:checked'), n=>Number(n.dataset.id));
    let mhNode = document.querySelector('#mhStones input:checked');
    if (mhNode) settings.mhStone = Number(mhNode.dataset.id);
    let ohNode = document.querySelector('#ohStones input:checked');
    if (ohNode) settings.ohStone = Number(ohNode.dataset.id);
    let drumsNode = document.querySelector('#activeBuffs input.drum:checked');
    if (drumsNode) settings.drums = Number(drumsNode.dataset.id);
    settings.numLusts = document.querySelectorAll('#activeBuffs input.lust:checked').length;
    settings.numFerocious = document.querySelectorAll('#activeBuffs input.ferocious:checked').length;
    settings.debuffs = Array.from(document.querySelectorAll('#debuffs input:checked'), n=>Number(n.dataset.id));
    settings.totems = Array.from(document.querySelectorAll('#activeBuffs input.totem:checked'), n=>Number(n.dataset.id));
    let itemInfo = getItems(document);
    settings.items = itemInfo.items;
    settings.gems = itemInfo.gems;
    settings.enchants = itemInfo.enchants;
    return settings;
}

function save(key, settings) {
    localStorage.setItem(key, JSON.stringify(settings));
}

function load(key) {
    let json = localStorage.getItem(key);
    return JSON.parse(json);
}

export {update, get, save, load, getItems, updateItems, updateStats, addTalents}