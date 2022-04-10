import { prototypes, utils, constants, visual } from '/game';
import { text } from 'game/visual';
import { roles } from './roles.mjs';
import { Squad } from './squad.mjs';

const SQUAD_SIZE = 3;
const ROLE_PARTS = 
{
    "TRANSPORTER": [constants.CARRY, constants.MOVE, constants.MOVE],
    "MELEE_ATTACKER": [constants.ATTACK, constants.MOVE, constants.MOVE, constants.MOVE, constants.MOVE, constants.MOVE],
    "HEALER": [constants.HEAL, constants.MOVE, constants.MOVE, constants.MOVE, constants.MOVE, constants.MOVE]
}

const SQUAD_COMPOSITION = 
{
    "MELEE_ATTACKER": 2,
    "HEALER": 1
}

var containers, spawn, enemySpawn;
var population = {};
var squads = [];

export function loop() 
{
    initMemory ();
    squads.forEach((squad, index, object) => 
        {
            squad.refreshCreeps();
            if (!squad.creeps.length)
            {
                object.splice(index, 1);
            }
        })

    let creeps = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => creep.my)
    let enemyCreeps = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my)

    population = 
    {
        "TRANSPORTER": [],
        "MELEE_ATTACKER": []
    };

    for(let creep of creeps)
    {
        text(
            creep.id + " s: " + creep.squadId,
            { x: creep.x, y: creep.y - 0.5 }, // above the creep
            {
                font: '0.5',
                opacity: 0.7,
                backgroundColor: '#808080',
                backgroundPadding: '0.03'
            });

        roles[creep.role].run(creep);
        
        if (!population[creep.role])
        {
            population[creep.role] = []
        }

        population[creep.role].push(creep);
    };

    manageSpawning ();

    let enemies = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);
    
    for (let squad of squads)
    {
        if (squad.filled)
        {
            if (enemies.length)
            {
                let closestEnemy = utils.findClosestByPath(squad.creeps[0], enemies);
                squad.squadMove(closestEnemy);
            }
            else
            {
                squad.squadMove(enemySpawn);
            }
        } 
        else 
        {
            let enemiesNearSpawn = utils.findInRange(spawn, enemyCreeps, 10);
            if (enemiesNearSpawn.length)
            {
                let target = utils.findClosestByRange(spawn, enemyCreeps);
                for (let creep of squad.creeps)
                {
                    if (creep.attack(target) == constants.ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
}

function initMemory()
{
    if (!spawn)
    {
        spawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => s.my)[0];
    }

    if (!enemySpawn)
    {
        enemySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(s => !s.my)[0];
    }

    if (!containers) 
    {
        containers = utils.getObjectsByPrototype(prototypes.StructureContainer);
    }
}

function getCreepParts(maxEnergy, parts)
{
    let body = [];
    let ratioCost = 0;

    for(let bodyPart of parts)
    {
        ratioCost += constants.BODYPART_COST[bodyPart];
    }
    
    let partsMultiple = Math.floor(maxEnergy / ratioCost)
    for(let i = 0; i < parts.length; i++)
    {
        for(let j = 0; j < partsMultiple; j++)
        {
            body.push(parts[i]);
        }
    }
    
    return body;
}

function manageSpawning()
{
    if (population["TRANSPORTER"].length < 2 && spawn.store.getFreeCapacity(constants.RESOURCE_ENERGY) <= 500)
    {
        let creepParts = getCreepParts(spawn.store.getUsedCapacity(constants.RESOURCE_ENERGY), ROLE_PARTS["TRANSPORTER"]);
        let spawnedCreep = spawn.spawnCreep(creepParts);

        if (!spawnedCreep.error)
        {
            let creep = spawnedCreep.object;
            creep.role = "TRANSPORTER";
        }

        return;
    }
    else if (spawn.store.getFreeCapacity(constants.RESOURCE_ENERGY) <= 300)
    {
        let openSquads = squads.filter(squad => !squad.filled);
        let squad = openSquads[0];
        if (!openSquads.length)
        {
            squad = new Squad(SQUAD_SIZE, SQUAD_COMPOSITION);
            squads.push(squad);
        }

        if (!squad.filled)
        {
            let nextRoleToSpawn = squad.getNextToSpawn();
            if (nextRoleToSpawn)
            {
                let creepParts = getCreepParts(spawn.store.getUsedCapacity(constants.RESOURCE_ENERGY), ROLE_PARTS[nextRoleToSpawn]);
                let spawnedCreep = spawn.spawnCreep(creepParts);
                if (!spawnedCreep.error)
                {
                    let creep = spawnedCreep.object;
                    creep.role = nextRoleToSpawn;
                    squad.addCreep(creep);
                }
                return;
            }
        }

    }
}

function assignToSquad(creep)
{
    for (let squad of squads)
    {
        if (!squad.filled)
        {
            squad.addCreep(creep);
            return;
        }
    }

    let newSquad = new Squad(creep, SQUAD_SIZE, SQUAD_COMPOSITION);
    squads.push(newSquad);
}

