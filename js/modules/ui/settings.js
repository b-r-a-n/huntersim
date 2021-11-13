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
        html += `<label><a href=${itemUrl}></a></label>`;
    }
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

export {update}