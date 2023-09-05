import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import { Transform } from 'UnityEngine';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour
{
    public SpawnPlayerAtTransform(t: Transform)
    {
        let spawnInfo = new SpawnInfo()
        spawnInfo.position = t.position;
        spawnInfo.rotation = t.rotation;
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawnInfo, true );

        ZepetoPlayers.instance.ZepetoCamera.gameObject.SetActive(false);
    }
}