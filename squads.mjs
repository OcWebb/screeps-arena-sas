
var squadSize = 3;
export var squads = {};

export function assignToSquad (creep)
{
    for (let idx in Object.keys(squads))
    {
        let squadId = Object.keys(squads)[idx].toString()
        if (squads[squadId] && squads[squadId].creeps.length < squadSize && !squads[squadId].filled)
        {
            creep['squadId'] = squadId;
            squads[squadId]['creeps'].push(creep);

            if (squads[squadId]['creeps'].length == squadSize)
            {
                squads[squadId]['filled'] = true;
            }
            return;
        }
    }
    
    let newSquadId = Math.floor(Math.random() * 50);
    while (Object.keys(squads).includes(newSquadId))
    {
        newSquadId = Math.floor(Math.random() * 50).toString();
    }

    creep.squadId = newSquadId;
    squads[newSquadId] = {};
    squads[newSquadId]['creeps'] = [];
    squads[newSquadId]['creeps'].push(creep);
    squads[newSquadId]['filled'] = false;
}