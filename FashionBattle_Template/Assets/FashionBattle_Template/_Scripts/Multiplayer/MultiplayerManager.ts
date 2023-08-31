import { Debug, GameObject } from 'UnityEngine';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import GameManager from '../Managers/GameManager';

export default class MultiplayerManager extends ZepetoScriptBehaviour {

    public static instance: MultiplayerManager;

    public multiplay: ZepetoWorldMultiplay;
    public room: Room;

    public testHeadItem: string;
    public testChestItem: string;
    public testLegsItem: string;
    public testFootItem: string;

    @Header("Players")
    public playersData: PlayerData[] = [];

    Awake() 
    {
        // Singleton pattern
        if (MultiplayerManager.instance != null) GameObject.Destroy(this.gameObject);
        else MultiplayerManager.instance = this;
    }

    Start() 
    {    
        if (!this.multiplay)
            this.multiplay = this.GetComponent<ZepetoWorldMultiplay>();
        if (!this.multiplay) console.warn("Add ZepetoWorldMultiplay First");
        this.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
            Debug.LogError("- - ROOM CREATED - -");
            this.AddMessageHandlers();
            this.SetInitialPlayerData();
        }
    }
    
    private AddMessageHandlers()
    {
        Debug.LogError("- - ADDED MESSAGE HANDLER - -");

        this.room.AddMessageHandler(MESSAGE.PlayerData, (playerData: PlayerData) => {
            if (this.CheckIfPlayerExist(playerData.ownerSessionId))
            {
                this.UpdatePlayerData(playerData);
            }
            else
            {
                this.CreateNewPlayerData(playerData);
            };

            Debug.LogError("PLAYERS COUNT: " + this.playersData.length)
        });
    }

    public OnPlayerDataArrive(playerData: PlayerData)
    {
        if (this.CheckIfPlayerExist(playerData.ownerSessionId)) {
            this.UpdatePlayerData(playerData);
        }
        else {
            this.CreateNewPlayerData(playerData);
        };
    }

    private SetInitialPlayerData()
    {
        Debug.LogError("- - SEND INITIAL DATA - -");
        this.SendPlayerData(this.room.SessionId);
    }

    private CheckIfPlayerExist(ownerSession: string) : bool
    {
        let result = false;
        this.playersData.forEach((pd) => {
            if (pd.ownerSessionId == ownerSession)
            {
                result = true;
            }
        });

        return result;
    }

    private UpdatePlayerData(playerData: PlayerData) {

    }

    private CreateNewPlayerData(playerData: PlayerData) {
        this.playersData.push(playerData);
    }


    private ClearPayersData() {
        this.playersData = [];
    }

    public SendPlayerData(ownerSessionId?: string)
    {
        const data = new RoomData();
        data.Add("ownerSessionId", ownerSessionId);
        
        data.Add("headItem", this.testHeadItem);
        data.Add("chestItem", this.testChestItem);
        data.Add("legsItem", this.testLegsItem);
        data.Add("footItem", this.testFootItem);

        this.room.Send(MESSAGE.PlayerData, data.GetObject());
    }

    public GetPlayersCount() : number
    {
        return this.playersData.Length;        
    }

    public IsMaster(): bool
    {
        let result = true;
        return result;
    }
}

interface PlayerData {
    ownerSessionId?: string;

    headItem?: number;
    chestItem?: number;
    legsItem?: number;
    footItem?: number;
}

enum MESSAGE {
    PlayerData = "PlayerData"
}