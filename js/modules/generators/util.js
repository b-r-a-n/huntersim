import {manaHandler, focusHandler} from './resource.js';
import {AutoShotGenerator} from './autoshot.js';
import {AutoAttackGenerator} from './autoattack.js';
import {CastGenerator} from './cast.js';
import {DamageGenerator} from './damage.js';
import {AuraGenerator, AuraHandler} from './aura.js';
import {ProcHandler} from './proc.js';
import {BuffHandler} from './buff.js';
import {AbilityGenerator} from './ability.js';
import * as Spells from '../data/spells.js';

function makeGenerators(simInputs) {
    return [
        manaHandler([simInputs.player.id]),
        focusHandler([simInputs.pet.id]),
        new AutoShotGenerator(simInputs.player.id, simInputs.target.id, 75),
        new AutoAttackGenerator(simInputs.pet.id, simInputs.target.id, 1),
        new CastGenerator(),
        new DamageGenerator(Object.values(Spells.all).filter(s=>s.ranged || s.melee).map(a=>a.id)),
        new AuraGenerator(),
        new AuraHandler(),
        new ProcHandler(simInputs.procs),
        new BuffHandler(),
        new AbilityGenerator(-1, simInputs.buffs.concat(simInputs.debuffs)),
        new AbilityGenerator(simInputs.player.id, simInputs.playerRules),
        new AbilityGenerator(simInputs.pet.id, simInputs.petRules),
    ]
}

export {makeGenerators}