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
        inputs.simTime, inputs.rand, inputs.player,
        inputs.pet, inputs.target, inputs.modifiedSpells, Spells.all
    );
    sim.run(generators);
    let dstProcs = sim.eventLog.filter(e=>e.type === 'buff' && e.abilityId==34774).length;
    let broochUses = sim.eventLog.filter(e=>e.type==='buff' && e.abilityId==35166).length;
    if (dstProcs < 1) throw 'dst was equipped but did not proc';
    if (broochUses < 1) throw 'bloodlust brooch was equipped but not used';
}
export {testTrinkets}