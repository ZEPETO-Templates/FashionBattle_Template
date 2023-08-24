import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour
{
    Start()
    {
        ZepetoPlayers.instance.CreatePlayerWithUserId( WorldService.userId, new SpawnInfo(), true );
    }
}