import * as Settings from './modules/settings.js';
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
    console.log('dmgmod', sim.player.rangedDamageMod(sim.target));
    console.log('bnsdmg', sim.player.bonusDamage(sim.target));
    console.log('rngap', sim.player.rangedAp(sim.target));
    console.log('mindmg', sim.player.minDamage(sim.target, 75));
    console.log('maxdmg', sim.player.maxDamage(sim.target, 75));
    console.log(sim.target, sim.target.armor);
    console.log(A.damageBySource(sim.eventLog));
    console.log(A.damageByAbility(sim, 1));
    console.log(A.damageByAbility(sim, 2));
}

document.addEventListener('DOMContentLoaded', function() {
    runTests();
    let settings = Settings.defaultSettings;
    let inputs = Inputs.create(settings);
    let generators = makeGenerators(inputs);
    let sim = new Simulation(
        inputs.simTime, inputs.rand, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    for (let aura of inputs.auras) {
        let tar = sim.entities[aura.targetId];
        tar.auras.push(aura);
    }
    sim.run(generators);
    printReports(sim);
}, false);