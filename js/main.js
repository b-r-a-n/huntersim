import * as Settings from './modules/settings.js';
import * as UISettings from './modules/ui/settings.js';
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

function runSim() {
    let settings = Settings.defaultSettings;
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
    printReports(sim);
}

document.addEventListener('DOMContentLoaded', function() {
    UISettings.update(document, Settings.defaultSettings);
}, false);