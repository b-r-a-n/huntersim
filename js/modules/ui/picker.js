import * as Items from '../data/items.js';
import * as Spells from '../data/spells.js';
import * as Settings from './settings.js';
import * as Util from './util.js';

function canEquip(invSlot, item) {
    switch(invSlot) {
        case 0: return item.slot == 24;
        case 12: return item.slot == 11;
        case 13:
        case 14: return item.slot == 12;
        case 15: return item.slot == 16;
        case 16: return [13, 21, 17].includes(item.slot);
        case 17: return [13, 22].includes(item.slot);
        case 18: return item.slot == 15;
        default: return invSlot == item.slot;
    }
}

const statWeights = {
    'ap': 0.4,
    'rap': 0.4,
    'agi': 0.85,
    'crit': 14,
    'rcrit': 14,
    'arpr': 0.12,
    'hstr': 0.7,
    'hit': 0.32,
    'hitr': 0.02,
    'critr': 0.66,
    'rhit': 0.32,
    'rhitr': 0.02,
    'rcritr': 0.66,
    'int': 0.01,
    'dps': 1,
};

function statWeight(item) {
    var weight = 0;
    for (let stat in item.stats) {
        if (stat === 'dps' && item.slot != 15) continue;
        weight += ((statWeights[stat] || 0) * (item.stats[stat] || 0));
    }
    if (item.class == 2 && item.subclass == 13) weight += (statWeights['critr']*14);
    return weight;
};

function replaceItem(invSlot, item) {
    let itemInfo = Settings.getItems(document);
    itemInfo.gems[invSlot] = [];
    delete itemInfo.enchants[invSlot];
    itemInfo.items[invSlot] = item.id;
    if (item.slot == 17) {
        itemInfo.items[17] = null;
        itemInfo.gems[17] = [];
        delete itemInfo.enchants[17];
    }
    if (invSlot == 17 && itemInfo.items[16] && Items.item(itemInfo.items[16]).slot == 17) {
        itemInfo.items[16] = null;
        itemInfo.gems[16] = [];
        delete itemInfo.enchants[16];
    }
    Settings.updateItems(document.querySelector('#items'), itemInfo.items, itemInfo.gems, itemInfo.enchants, true);
}

function replaceGem(invSlot, socket, item) {
    let itemInfo = Settings.getItems(document);
    itemInfo.gems[invSlot] = itemInfo.gems[invSlot] || [null, null, null];
    itemInfo.gems[invSlot][socket] = item.id;
    Settings.updateItems(document.querySelector('#items'), itemInfo.items, itemInfo.gems, itemInfo.enchants, true);
}

function replaceEnchant(invSlot, item) {
    let itemInfo = Settings.getItems(document);
    itemInfo.enchants[invSlot] = item.id;
    Settings.updateItems(document.querySelector('#items'), itemInfo.items, itemInfo.gems, itemInfo.enchants, true);
}

function hide(selector) {
    selector.style.display = 'none';
}

function findNode(target, classes) {
    for (let node of target.path) {
        let type = node.dataset.type;
        if (type && classes.includes(type)) return node;
    }
    return null;
}

function itemFilter(inventorySlot, phase) { 
    return (i) => { return (i.phase <= phase) && canEquip(inventorySlot, i); }
}

function gemFilter(phase) { 
    let filterGems = [24055, 32409, 24028, 24028, 31868, 31868, 24067];
    return (i) => { return (i.class == 3) && filterGems.includes(i.id); };
}

function enchantFilter(inventorySlot) {
    return (s) => { return s.enchId && s.slots.includes(Number(inventorySlot)); };
}

function addItems(picker, items, inventorySlot, socket, itemType) {
    for (let result of items) {
        let onclick = (e) => { 
            e.preventDefault(); 
            if (itemType === 'enchant') { replaceEnchant(inventorySlot, result); }
            else if (itemType === 'gem') { replaceGem(inventorySlot, socket, result); }
            else { replaceItem(inventorySlot, result); }
            hide(picker); 
        };
        let queryType = (!(itemType === 'enchant') || (inventorySlot == 1 || inventorySlot == 3)) ? 'item' : 'spell';
        let url = Util.whUrl(queryType, result.id);
        let itemRow = Util.t2e(`<div><a data-wh-icon-size='tiny' href='${url}'></a></div>`);
        itemRow[0].onclick = onclick;
        picker.append(...itemRow);
    }
}

function show(target) {
    let left = target.pageX;
    let top = target.pageY;
    target.preventDefault();
    let classes = ['item', 'gem', 'enchant'];
    let node = findNode(target, classes);
    let inventorySlot = Number(node.dataset.slot);
    var filterFn = null;
    var isEnchant = false;
    var isGem = false;
    var socket = null;
    switch (node.dataset.type) {
        case 'item': {
            filterFn = itemFilter(inventorySlot, 2);
            break;
        }
        case 'gem': {
            filterFn = gemFilter(2);
            isGem = true;
            socket = Number(node.dataset.socket);
            break;
        }
        case 'enchant': {
            filterFn = enchantFilter(inventorySlot);
            isEnchant = true;
            break;
        }
    }
    let picker = document.querySelector('#picker');
    picker.replaceChildren([]);
    let w = (a, b) => {
        let aw = statWeight(a);
        let bw = statWeight(b);
        if (aw < bw) return 1;
        if (aw > bw) return -1;
        return 0;
    }
    var results = Object.values(isEnchant ? Spells.all : Items.all).filter(filterFn).sort(w).slice(0,20);
    let searchBar = Util.t2e(`<div><input class='searchbar' type='text'></input></div>`);
    searchBar[0].oninput = (e) => { 
        let items = Items.find(e.target.value, filterFn);
        while (picker.childElementCount > 1) picker.removeChild(picker.lastChild);
        addItems(picker, items, inventorySlot, socket, node.dataset.type);
        $WowheadPower.refreshLinks();
    };
    picker.append(...searchBar);
    addItems(picker, results, inventorySlot, socket, node.dataset.type);
    $WowheadPower.refreshLinks();
    document.getElementById('picker').style.left = left;
    document.getElementById('picker').style.top = top;
    document.getElementById('picker').style.transform = 'translate(-100%, 0)';
    document.getElementById('picker').style.display = 'block';
}

export {show, hide}