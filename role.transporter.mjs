import { prototypes, utils, constants } from '/game';

var spawn, enemySpawn, containers;

export var roleTransporter = 
{
    run (creep)
    {
        this.initMemory();
        containers = utils.getObjectsByPrototype(prototypes.StructureContainer);

        let filledContainers = containers.filter(container => container.store.getUsedCapacity(constants.RESOURCE_ENERGY) > 0);
        let container = utils.findClosestByPath(creep, filledContainers);
        // console.log(containers)

        if(creep.store.getFreeCapacity(constants.RESOURCE_ENERGY)) 
        {
            if (container && creep.withdraw(container, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(container);
            }
        } 
        else 
        {
            if(creep.transfer(spawn, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(spawn);
            }
        }
    },


    initMemory ()
    {
        if (!spawn)
        {
            spawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => s.my)[0];
        }

        if (!enemySpawn)
        {
            enemySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => !s.my)[0];
        }
    }
};