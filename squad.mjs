import { prototypes, utils, constants } from '/game';

export class Squad
{
    constructor (size, composition)
    {
        this.id = utils.getTicks();
        this.creeps = [];
        this.size = size;
        this.spread = 1;
        this.filled = false;
        this.composition = composition;
    }
    
    refreshCreeps()
    {
        this.creeps = utils.getObjectsByPrototype(prototypes.Creep).filter(c => c.my && c.squadId == this.id);
    }

    getNextToSpawn()
    {
        for (let role of Object.keys(this.composition))
        {
            let creepsWithThisRole = this.creeps.filter(creep => creep.role == role).length;
            if (creepsWithThisRole < this.composition[role])
            {
                return role;
            }
        }
    }

    addCreep(creep)
    {
        this.creeps.push(creep);
        creep.squadId = this.id;

        if (this.creeps.length >= this.size)
        {
            this.filled = true;
        }
    }

    squadMove()
    {
        let closestCreepToTarget = utils.findClosestByPath(target, this.creeps);
        let creepsThatNeedToCatchUp = [];
        for (let squadMember of this.creeps)
        {
            let squadIsInRange = utils.findInRange(squadMember, this.creeps, this.spread);
            // console.log(squadMember.id + " in range? " + squadIsInRange.length)
            if (squadIsInRange.length <= 1 && squadMember.id != closestCreepToTarget.id)
            {
                creepsThatNeedToCatchUp.push(squadMember);
            }
        }
        
        if (creepsThatNeedToCatchUp.length)
        {
            for (let squadMember of creepsThatNeedToCatchUp)
            {
                squadMember.moveTo(closestCreepToTarget);
            }
        } 
        else
        {
            for (let squadMember of this.creeps)
            {
                squadMember.moveTo(target);
            }
        }
    }
}