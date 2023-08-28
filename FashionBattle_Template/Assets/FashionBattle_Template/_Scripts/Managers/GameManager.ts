import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject } from 'UnityEngine';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';

export default class GameManager extends ZepetoScriptBehaviour 
{
    public static instance: GameManager;

    public playerCount: number;

    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;
    }

    public Test()
    {
        this.playerCount = MultiplayerManager.instance.GetPlayersCount();
    }

}