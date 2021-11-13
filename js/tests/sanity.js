import * as Settings from '../modules/settings.js';
import * as Inputs from '../modules/siminputs.js';
import * as Spells from '../modules/data/spells.js';
import {Simulation} from '../modules/sim.js';
import {makeGenerators} from '../modules/generators/util.js';


function testTrinkets() {
    let settings = Settings.defaultSettings;
    settings.items[13] = 28830;
    settings.items[14] = 29383;
    let inputs = Inputs.create(settings);
    let generators = makeGenerators(inputs);
    let sim = new Simulation(
        inputs.simTime, inputs.seed, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    sim.run(generators);
    let dstProcs = sim.eventLog.filter(e=>e.type === 'buff' && e.abilityId==34774).length;
    let broochUses = sim.eventLog.filter(e=>e.type==='buff' && e.abilityId==35166).length;
    if (dstProcs < 1) throw 'dst was equipped but did not proc';
    if (broochUses < 1) throw 'bloodlust brooch was equipped but not used';
}
function testPerHitAura() {
    let settings = Settings.defaultSettings;
    settings.items[13] = 34427;
    settings.items[14] = 29383;
    let inputs = Inputs.create(settings);
    let generators = makeGenerators(inputs);
    let sim = new Simulation(
        inputs.simTime, inputs.seed, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    sim.run(generators);
    let  naaruBuff = sim.eventLog.filter(e=>e.type === 'buff' && e.abilityId == 45355).length;
    console.log(sim.player);
    let  naaruDebuff = sim.eventLog.filter(e=>e.type === 'removebuff' && e.abilityId == 45355).length;
    if (naaruBuff < 1) throw 'naaru sliver was equipped but did not proc';
    if (naaruDebuff < 1) throw 'naaru sliver buff never expired';
}
function testRiftStalkerBonus() {
    let settings = Settings.defaultSettings;
    var inputs = Inputs.create(settings);
    let critWithBonus = inputs.player.crit({}, 34120);
    settings.items[1] = 32474;
    inputs = Inputs.create(settings);
    let crit = inputs.player.crit({}, 34120);
    console.log(critWithBonus, crit);
}
function testIdempotency() {
    let settings = Settings.defaultSettings;
    var inputs = Inputs.create(settings);
    var generators = makeGenerators(inputs);
    let firstRun = new Simulation(
        inputs.simTime, inputs.seed, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    firstRun.run(generators);

    generators = makeGenerators(inputs);
    let secondRun = new Simulation(
        inputs.simTime, inputs.seed, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    secondRun.run(generators);
    if (firstRun.eventLog.length != secondRun.eventLog.length) {
        throw `runs with same input should have same event count ${firstRun.eventLog.length} vs ${secondRun.eventLog.length}`;
    }
}
function compareTrinkets() {
    let settings = Settings.defaultSettings;
    var inputs = Inputs.create(settings);
    var avg = 0;
    for (let idx in Array(100).fill(0)) {
        var generators = makeGenerators(inputs);
        let run = new Simulation(
            inputs.simTime, idx, inputs.player,
            inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
        );
        run.run(generators);
        let dmg = run.eventLog.filter(e=>e.type === 'damage' && e.sourceId == 1).reduce((p,c)=>{ p = p+c.damage; return p;}, 0);
        avg += dmg;
    }
    console.log('Run avg DPS:', (avg/100)/settings.fightDuration);

    settings.items[13] = 32505;
    inputs = Inputs.create(settings);
    avg = 0;
    for (let idx in Array(100).fill(0)) {
        var generators = makeGenerators(inputs);
        let run = new Simulation(
            inputs.simTime, idx, inputs.player,
            inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
        );
        run.run(generators);
        let dmg = run.eventLog.filter(e=>e.type === 'damage' && e.sourceId == 1).reduce((p,c)=>{ p = p+c.damage; return p;}, 0);
        avg += dmg
    }
    console.log('Run avg DPS:', (avg/100)/settings.fightDuration);
}
export {testTrinkets, testPerHitAura, testRiftStalkerBonus, testIdempotency, compareTrinkets}