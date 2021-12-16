import * as Settings from './modules/settings.js';
import * as UISettings from './modules/ui/settings.js';
import * as UIResults from './modules/ui/results.js';
import * as Inputs from './modules/siminputs.js';

const VERSION = "0.9.0";

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