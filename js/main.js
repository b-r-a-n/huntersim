import * as Settings from './modules/settings.js';
import * as UISettings from './modules/ui/settings.js';
import * as UIResults from './modules/ui/results.js';
import * as Inputs from './modules/siminputs.js';
import * as Spells from './modules/data/spells.js';
import {Simulation} from './modules/sim.js';
import {makeGenerators} from './modules/generators/util.js';

import * as T from './tests/sanity.js';
function runTests() {
    for (let f in T) {
        try { T[f](); }
        catch(e) { console.error(e); }
    }
}

import * as A from './modules/analysis.js';
function printReports(sim) {
    console.log(sim.player);
    console.log(sim.target, sim.target.armor);
    console.log(A.damageBySource(sim.eventLog));
    console.log(A.damageByAbility(sim, 1));
    console.log(A.damageByAbility(sim, 2));
    console.log(A.castsByType(sim.eventLog));
}

function saveRecent(settings, result) {
    let nextKey = localStorage.getItem('nextKey') || 'prev0';
    let idx = Number(nextKey.split('prev')[1]);
    settings.result = result;
    settings.savedTs = Date.now();
    UISettings.save(nextKey, settings);
    localStorage.setItem('nextKey', 'prev' + (idx+1)%5);
}

function runSim() {
    let settings = UISettings.get(document);
    let hunterDps = 0;
    let petDps = 0;
    var i = 0;
    var lastSim = null;
    while (i < 10) {
        settings.randomSeed = i*10;
        let inputs = Inputs.create(settings);
        let generators = makeGenerators(inputs);
        let sim = new Simulation(
            inputs.simTime, inputs.seed, inputs.player,
            inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
        );
        for (let aura of inputs.auras) {
            let tar = sim.entities[aura.targetId];
            tar.auras.push(aura);
        }
        sim.run(generators);
        lastSim = sim;
        let result = A.damageBySource(sim.eventLog);
        hunterDps += result[inputs.player.id];
        petDps += result[inputs.pet.id];
        i++;
    }
    saveRecent(settings, {hunter: hunterDps/i, pet: petDps/i});
    UIResults.update(document, lastSim);
}

function settingsChanged(e) {
    let newSettings = UISettings.get(document);
    let input = Inputs.create(newSettings);
    UISettings.save('lastused', newSettings);
    UISettings.updateStats(document.querySelector('#stats'), input.player, input.target);
    $WowheadPower.refreshLinks();
}


document.addEventListener('DOMContentLoaded', function() {
    UIResults.updateHistory(document.querySelector('#history'));
    let settings = UISettings.load('lastused') || Settings.defaultSettings;
    UISettings.update(document, settings);
    document.querySelector('#runButton').onclick = runSim;
    document.querySelector('#settings').addEventListener('change', settingsChanged);
    $WowheadPower.refreshLinks();
}, false);