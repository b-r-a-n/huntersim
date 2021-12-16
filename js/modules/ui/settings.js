import * as Util from './util.js';
import * as UIPicker from './picker.js';
import * as Items from '../data/items.js';
import * as Races from '../data/races.js';
import * as Spells from '../data/spells.js';
import * as Talents from '../data/talents.js';
import * as Inputs from '../siminputs.js';

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

function addElementsById(selector, type, spellIds, checkedIds, name) {
    var spells = [];
    for (let id of spellIds) {
        spells.push({
            id: id,
            url: Util.whUrl(type, id),
            checked: checkedIds.includes(id)
        });
    }
    let legendElement = Util.t2e(`<legend>${name}</legend>`)
    let spellElements = Util.checkbox(spells);
    for (let el of spellElements) {
        el.querySelector("a").onclick = (e) => { e.preventDefault(); e.target.parentNode.parentNode.querySelector("input").click(); };
    }
    selector.replaceChildren(...legendElement);
    selector.append(...spellElements);
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
function updateStats(selector, stats) {
    let html = `<div id='rap'>Ranged Ap<hr>${stats.ranged_ap}</div>`;
    html += `<div id='agi'>Agility<hr>${stats.agi}</div>`;
    html += `<div id='crt'>Ranged Crit<hr>${Math.floor(stats.crit*10000)/100}%</div>`;
    html += `<div id='hit'>Ranged Hit<hr>${Math.floor(stats.hit*10000)/100}%</div>`;
    html += `<div id='hit'>Ranged Haste<hr>${Math.floor(stats.haste*10000)/100}%</div>`;
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

function update(document, settings, data={}) {
    // Individual Settings
    document.getElementById('fightDuration').value = settings.fightDuration;
    document.getElementById('iterations').value = settings.iterations;
    document.getElementById('randomSeed').value = settings.randomSeed;
    document.getElementById('targetArmor').value = settings.targetArmor;
    document.getElementById('targetType').value = settings.targetType;
    document.getElementById('petFamily').value = settings.petFamily;
    document.getElementById('encodedTalents').value = settings.encodedTalents;
    
    // race
    let racesSel = document.querySelector('#races');
    racesSel.replaceChildren(...Util.t2e('<legend>Race</legend>'));
    for (let race of Object.values(Races.all)) {
        var html = `<label class='btn'><input type='radio' data-id=${race.id} name='race'${race.id === settings.race ? ' checked' : ''}>`;
        html += `<a class='icon ${race.id}' href='https://tbc.wowhead.com/${race.id}'>${race.name}</a></label>`;
        racesSel.append(...Util.t2e(html));
    }
    
    // Passive Buffs
    addElementsById(document.querySelector('#passiveBuffs'), 'spell', data.passiveBuffs || [], settings.passiveBuffs || [], 'Passive Buffs');

    // Active Buffs
    addElementsById(document.querySelector('#activatedBuffs'), 'spell', data.activeBuffs || [], settings.activeBuffs || [], 'Active Buffs');

    // Activated Items
    let items = [
        22838, // Haste Pot
        22832, // Super Mana Pot
        31677, // Fel-mana Pot
        20520, // Dark Rune
        29528, // Drums of War
        29529, // Drums of Battle
        185848, // Greater Drums of Battle
        185852, // Greater Drums of War
    ];
    addElementsById(document.querySelector('#activatedItems'), 'item', items, settings.activeItems || [], 'Consumables');

    // Active Buffs
    addElementsById(document.querySelector('#activatedDebuffs'), 'spell', data.activeDebuffs || [], settings.activeDebuffs || [], 'Debuffs');

    // Abilities
    addElementsById(document.querySelector('#abilities'), 'spell', data.abilities || [], settings.abilities || [], 'Abilities');

    // Stones
    addStones(document.querySelector('#mhStones'), settings, 'mh');
    addStones(document.querySelector('#ohStones'), settings, 'oh');

    // Talents
    addTalents(document.querySelector('#talents'), settings.encodedTalents);

    // Stats
    let input = Inputs.create_wasm(settings);
    let stats = get_stats(JSON.stringify(input));
    updateStats(document.querySelector('#stats'), stats);

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
    settings.passiveBuffs = Array.from(document.querySelectorAll("#passiveBuffs input:checked"), n=>Number(n.dataset.id));
    settings.activeBuffs = Array.from(document.querySelectorAll("#activatedBuffs input:checked"), n=>Number(n.dataset.id));
    settings.activeDebuffs = Array.from(document.querySelectorAll("#activatedDebuffs input:checked"), n=>Number(n.dataset.id));
    settings.abilities = Array.from(document.querySelectorAll("#abilities input:checked"), n=>Number(n.dataset.id));
    settings.activeItems = Array.from(document.querySelectorAll("#activatedItems input:checked"), n=>Number(n.dataset.id));
    settings.petFamily = document.getElementById('petFamily').value;
    settings.fightDuration = Number(document.getElementById('fightDuration').value);
    settings.iterations = Number(document.getElementById('iterations').value);
    settings.randomSeed = Number(document.getElementById('randomSeed').value);
    settings.targetArmor = Number(document.getElementById('targetArmor').value);
    settings.targetType = document.getElementById('targetType').value;
    settings.encodedTalents = document.getElementById('encodedTalents').value;
    settings.quiverHaste = 15;
    settings.race = document.querySelector('#races input:checked').dataset.id;
    let mhNode = document.querySelector('#mhStones input:checked');
    if (mhNode) settings.mhStone = Number(mhNode.dataset.id);
    let ohNode = document.querySelector('#ohStones input:checked');
    if (ohNode) settings.ohStone = Number(ohNode.dataset.id);
    settings.numLusts = document.querySelectorAll('#activeBuffs input.lust:checked').length;
    settings.numFerocious = document.querySelectorAll('#activeBuffs input.ferocious:checked').length;
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