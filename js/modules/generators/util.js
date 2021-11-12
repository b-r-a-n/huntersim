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
        new AutoShotGenerator(simInputs.player, simInputs.target, 75),
        new AutoAttackGenerator(simInputs.pet, simInputs.target, 1),
        new CastGenerator(),
        new DamageGenerator(Object.values(Spells.all).filter(s=>s.ranged || s.melee).map(a=>a.id)),
        new AuraGenerator(),
        new AuraHandler(),
        new ProcHandler(simInputs.procs),
        new BuffHandler(),
        new AbilityGenerator({id: -1}, simInputs.buffs.concat(simInputs.debuffs)),
        new AbilityGenerator(simInputs.player, simInputs.playerRules),
        new AbilityGenerator(simInputs.pet, simInputs.petRules),
    ]
}

export {makeGenerators}