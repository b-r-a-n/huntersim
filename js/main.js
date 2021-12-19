import * as Settings from './modules/settings.js';
import * as UISettings from './modules/ui/settings.js';
import * as UIResults from './modules/ui/results.js';
import * as Inputs from './modules/siminputs.js';
import * as Items from './modules/data/items.js';
import * as Picker from './modules/ui/picker.js';

const VERSION = "0.9.4";

function saveRecent(settings, result) {
    let nextKey = localStorage.getItem('nextKey') || 'prev0';
    let idx = Number(nextKey.split('prev')[1]);
    settings.result = result;
    settings.savedTs = Date.now();
    UISettings.save(nextKey, settings);
    localStorage.setItem('nextKey', 'prev' + (idx+1)%5);
}

function runWasmSim() {
    let settings = UISettings.get(document);
    let inputs = Inputs.create_wasm(settings);
    let result = run_sim(JSON.stringify(inputs));
    saveRecent(settings, {hunter: result.dps, pet: result.pet_dps});
    UIResults.update(document, result, 0, 1000);
}
function defaultGem(socketType, socketBonus) {
    if (socketType == 1) return 32409;
    let bonus = Inputs.socketBonuses[socketBonus];
    if (bonus.agi && bonus.agi >= 3) {
        if (socketType == 2) return 24028; // red
        if (socketType == 3) return 31868; // yellow
        if (socketType == 4) return 24055; // blue
    }
    return 24028;
}

function runUpgradeFinder() {
    let settings = UISettings.get(document);
    let inputs = Inputs.create_wasm(settings);
    let result = run_sim(JSON.stringify(inputs));
    let baselineDPS = result.dps + result.pet_dps;
    for (let slot in settings.items) {
        let runs = [];
        if (Number(slot) == 0) continue;
        let options = Object.values(Items.all).filter(Picker.itemFilter(Number(slot), 4)).sort(Picker.compareWeight).slice(0, 10);
        for (let option of options) {
            let copySettings = JSON.parse(JSON.stringify(settings));
            copySettings.items[slot] = option.id;
            let gems = [];
            if (option.socket1) gems.push(defaultGem(option.socket1, option.socketbonus));
            if (option.socket2) gems.push(defaultGem(option.socket2, option.socketbonus));
            if (option.socket3) gems.push(defaultGem(option.socket3, option.socketbonus));
            if (gems.length > 0) { copySettings.gems[slot] = gems; } else { delete copySettings.gems[slot]; }
            let input = Inputs.create_wasm(copySettings);
            runs.push({input: input, itemName: option.name});
        }
        let worker = new Worker('./js/worker.js');
        worker.onmessage = (e) => { 
            for (let upgrade of e.data) {
                if (upgrade.dps - baselineDPS > 0) {
                    let curr = Items.item(settings.items[slot]);
                    console.log(upgrade.dps - baselineDPS, ';', upgrade.itemName, ';', curr.name, ';', slot); 
                } else {
                    break;
                }
            }
        };
        worker.postMessage(runs);
    }
    
}

function runUpgradeSlotFinder(slot) {
    let settings = UISettings.get(document);
    let inputs = Inputs.create_wasm(settings);
    let result = run_sim(JSON.stringify(inputs));
    let baselineDPS = result.dps + result.pet_dps;
    let options = Object.values(Items.all).filter(Picker.itemFilter(Number(slot), 6)).sort(Picker.compareWeight).slice(0, 25);
    for (let option of options) {
        let runs = [];
        let copySettings = JSON.parse(JSON.stringify(settings));
        copySettings.items[slot] = option.id;
        let gems = [];
        if (option.socket1) gems.push(defaultGem(option.socket1, option.socketbonus));
        if (option.socket2) gems.push(defaultGem(option.socket2, option.socketbonus));
        if (option.socket3) gems.push(defaultGem(option.socket3, option.socketbonus));
        if (gems.length > 0) { copySettings.gems[slot] = gems; } else { delete copySettings.gems[slot]; }
        let input = Inputs.create_wasm(copySettings);
        runs.push({input: input, itemName: option.name});
        let worker = new Worker('./js/worker.js');
        worker.onmessage = (e) => { 
            for (let upgrade of e.data) {
                if (upgrade.dps - baselineDPS > 0) {
                    let curr = Items.item(settings.items[slot]);
                    console.log(upgrade.dps - baselineDPS, ';', upgrade.itemName, ';', curr.name, ';', slot); 
                } else {
                    break;
                }
            }
        };
        worker.postMessage(runs);
    }
    
}

function settingsChanged(e) {
    let newSettings = UISettings.get(document);
    newSettings.version = VERSION;
    let input = Inputs.create_wasm(newSettings);
    let stats = get_stats(JSON.stringify(input));
    UISettings.save('lastused', newSettings);
    UISettings.addTalents(document.querySelector('#talents'), newSettings.encodedTalents);
    UISettings.updateStats(document.querySelector('#stats'), stats);
    $WowheadPower.refreshLinks();
}

document.addEventListener('DOMContentLoaded', async function() {
    UIResults.updateHistory(document.querySelector('#history'));
    let settings = UISettings.load('lastused') || Settings.defaultSettings;
    if (settings.version != VERSION) { settings = Settings.defaultSettings; }
    let data = await load_data();
    UISettings.update(document, settings, data);
    document.querySelector('#runButton').onclick = runWasmSim;
    document.querySelector('#settings').addEventListener('change', settingsChanged);
    $WowheadPower.refreshLinks();
}, false);