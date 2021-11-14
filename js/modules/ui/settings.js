import * as Util from './util.js';
import * as Spells from '../data/spells.js';
import * as Races from '../data/races.js';

function addFoodBuffs(document, settings) {
    var foods = [];
    for (let food of Object.values(Spells.all).filter(s=>s.food)) {
        foods.push({
            id: food.id,
            url: Util.whUrl('spell', food.id),
            checked: settings.passiveBuffs.includes(food.id)
        });
    }
    let legend = Util.t2e('<legend>Food Buffs</legend>')
    let elements = Util.radiobox(foods, 'foods', true);
    document.querySelector('#foodBuffs').replaceChildren(...legend);
    document.querySelector('#foodBuffs').append(...elements);
}

function addSpell(selector, id, checked=false) {
    let spell = Spells.spell(id);
    let option = {id: spell.id, url: Util.whUrl('spell', spell.id), checked: checked};
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

function addTalents(selector, encodedTalents) {
    let whTalentLink = `<a href='https://tbc.wowhead.com/talent-calc/embed/hunter/${encodedTalents}'></a>`;
    selector.replaceChildren(...Util.t2e(whTalentLink));
}

function addItems(selector, itemIds, gemIds, enchantIds) {
    var html = '<legend>Items</legend>';
    html += '<div class="itemgrid">';
    for (let invSlot in itemIds) {
        let slotItemId = itemIds[invSlot];
        if (!slotItemId) continue;
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
        html += `<div class='item' data-id=${slotItemId} data-slot=${invSlot}><a href=${itemUrl}></a></div>`;
        var gemSocketIndex = 0;
        while (gemSocketIndex < 3) {
            if (slotGemIds[gemSocketIndex]) {
                let gemId = slotGemIds[gemSocketIndex];
                let gemUrl = Util.whUrl('item', gemId);
                html += `<a class='gem' data-id=${gemId} data-slot=${invSlot} data-wh-rename-link='false' href=${gemUrl}></a>`;
            } else {
                html += '<span></span>';
            }
            gemSocketIndex++;
        }
        if (slotEnchantId) {
            let type = [1,3,6].includes(Number(invSlot)) ? 'item' : 'spell';
            let enchUrl = Util.whUrl(type, slotEnchantId);
            html += `<a class='enchant' data-id=${slotEnchantId} data-slot=${invSlot} data-wh-rename-link='false' href=${enchUrl}></a></span>`;
        } else {
            html += `<span></span>`;
        }
    }
    html += '</div>';
    selector.replaceChildren(...Util.t2e(html));
}

function update(document, settings) {
    // Individual Settings
    document.getElementById('fightDuration').value = settings.fightDuration;
    document.getElementById('randomSeed').value = settings.randomSeed;
    document.getElementById('targetArmor').value = settings.targetArmor;
    document.getElementById('targetType').value = settings.targetType;
    document.getElementById('encodedTalents').value = settings.encodedTalents;
    document.getElementById('quiverHaste').value = settings.quiverHaste;
    
    // race
    let racesSel = document.querySelector('#races');
    racesSel.replaceChildren(...Util.t2e('<legend>Race</legend>'));
    for (let race of Object.values(Races.all)) {
        var html = `<label><input type='radio' data-id=${race.id} name='race'${race.id === settings.race ? ' checked' : ''}>`;
        html += `<a class='icon ${race.id}' href='https://tbc.wowhead.com/${race.id}'>${race.name}</a></label>`;
        racesSel.append(...Util.t2e(html));
    }
    
    // buffs
    addSpells(document.querySelector('#staticBuffs'), settings.passiveBuffs, 'Static Buffs', s=>s.buff);

    // Food
    addFoodBuffs(document, settings);

    // Pet Consumes
    addSpells(document.querySelector('#petBuffs'), settings.petBuffs, 'Pet Buffs', s=>s.petbuff);

    // Pet Abilities
    addSpells(document.querySelector('#petAbilities'), settings.petAbilities, 'Pet Abilities', s=>s.petFamily && s.petFamily.includes(settings.petFamily));

    // Lusts
    var n = 0
    var sel = document.querySelector('#lusts');
    sel.replaceChildren(...Util.t2e('<legend>Lusts</legend>'))
    while (n < 4) {
        addSpell(sel, 2825, n<settings.numLusts);
        n++;
    }

    // FI
    n = 0
    sel = document.querySelector('#ferociousInspirations')
    sel.replaceChildren(...Util.t2e('<legend>Ferocious Inspiration</legend>'))
    while (n < 4) {
        addSpell(sel, 34460, n<settings.numLusts)
        n++;
    }

    // Shaman
    addSpells(document.querySelector('#shamanBuffs'), settings.totems, 'Shaman Buffs', s=>s.shaman||s.totem);

    // Debuff
    addSpells(document.querySelector('#debuffs'), settings.debuffs, 'Debuffs', s=>s.type === 'debuff');

    // Talents
    // addTalents(document.querySelector('#talents'), settings.encodedTalents);

    // Items
    addItems(document.querySelector('#items'), settings.items, settings.gems, settings.enchants);

    $WowheadPower.refreshLinks();
}

function get(document) {
    let settings = {};
    settings.fightDuration = Number(document.getElementById('fightDuration').value);
    settings.randomSeed = Number(document.getElementById('randomSeed').value);
    settings.targetArmor = Number(document.getElementById('targetArmor').value);
    settings.targetType = document.getElementById('targetType').value;
    settings.encodedTalents = document.getElementById('encodedTalents').value;
    settings.quiverHaste = Number(document.getElementById('quiverHaste').value);
    settings.race = document.querySelector('#races input:checked').dataset.id;
    let passive = Array.from(document.querySelectorAll('#staticBuffs input:checked'), n=>Number(n.dataset.id));
    let food = Array.from(document.querySelectorAll('#foodBuffs input:checked'), n=>Number(n.dataset.id));
    settings.passiveBuffs = passive.concat(food);
    settings.petBuffs = Array.from(document.querySelectorAll('#petBuffs input:checked'), n=>Number(n.dataset.id));
    settings.petAbilities = Array.from(document.querySelectorAll('#petAbilities input:checked'), n=>Number(n.dataset.id));
    // Stones
    // Drums
    settings.numLusts = document.querySelectorAll('#lusts input:checked').length;
    settings.numFerocious = document.querySelectorAll('#ferociousInspirations input:checked').length;
    settings.debuffs = Array.from(document.querySelectorAll('#debuffs input:checked'), n=>Number(n.dataset.id));
    settings.totems = Array.from(document.querySelectorAll('#shamanBuffs input:checked'), n=>Number(n.dataset.id));
    settings.items = Array.from(document.querySelectorAll('#items .item'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = Number(c.id); return p;
    }, Array(19));
    // Gems
    settings.gems = Array.from(document.querySelectorAll('#items .gem'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = p[Number(c.slot)] || [];
        p[Number(c.slot)].push(Number(c.id)); return p;
    }, {});
    // Enchants
    settings.enchants = Array.from(document.querySelectorAll('#items .enchant'), n=>n.dataset).reduce((p,c)=> {
        p[Number(c.slot)] = Number(c.id); return p;
    }, {});
    // Pet family
    return settings;
}

export {update, get}