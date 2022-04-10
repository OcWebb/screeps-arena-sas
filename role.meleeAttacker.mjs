import { prototypes, utils, constants } from '/game';

var spawn, enemySpawn, containers;

export var roleMeleeAttacker = 
{
    run (creep)
    {
        // this.initMemory(creep);
        // let enemies = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);

        // let target = null;
        // if (enemies.length)
        // {
        //     target = utils.findInRange(creep, enemies, 2)[0];
        // } 
        // else if (enemySpawn)
        // {
        //     target = enemySpawn;
        // }

        // if (target)
        // {
        //     creep.attack(target);
        // }
        
    },


    initMemory (creep)
    {
        // if (!spawn)
        // {
        //     spawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => s.my)[0];
        // }

        // if (!enemySpawn)
        // {
        //     enemySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => !s.my)[0];
        // }

        // if (!containers) 
        // {
        //     containers = utils.getObjectsByPrototype(prototypes.StructureContainer);
        // }
    }
};