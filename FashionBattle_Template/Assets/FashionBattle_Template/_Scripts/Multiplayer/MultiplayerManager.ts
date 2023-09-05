import { Debug, GameObject, Input, KeyCode, Time, Transform } from 'UnityEngine';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WorldService, ZepetoWorldMultiplay } from 'ZEPETO.World';
import PlayerData from './PlayerData';
import GameManager, { STAGE } from '../Managers/GameManager';
import UIManager, { UIPanelType } from '../Managers/UIManager';
import { State } from 'ZEPETO.Multiplay.Schema';
import PlayerSpawner from './PlayerSpawner';

export enum ITEM_TYPE {
    HEAD,
    CHEST,
    LEGS,
    FOOT
}

export default class MultiplayerManager extends ZepetoScriptBehaviour {

    public static instance: MultiplayerManager;

    public multiplay: ZepetoWorldMultiplay;
    
    public localPlayerData: PlayerData;
    
    @Header("Players")
    public playersData: PlayerDataModel[] = [];
    
    public allPlayersReady: bool = false;
    
    private _room: Room;
    
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
            this._room = room;
            this._room.OnStateChange += this.OnStateChange;
            this.AddMessageHandlers();
            this.SetInitialPlayerData();
        }
    }

    private OnStateChange(state: State, isFirst: boolean) 
    {
        PlayerSpawner.instance.OnStateChange(state, isFirst);
    }
    
    private AddMessageHandlers()
    {
        this._room.AddMessageHandler(MESSAGE.OnPlayersReady, (value: string) =>
        {
            if(value == "True")
            {
                this.allPlayersReady = true;
            }
            else if(value == "False")
            {
                this.allPlayersReady = false;
            }

            this.RequestPlayersDataCache();

            GameManager.instance.SetGameReadyToStart(this.allPlayersReady);
        });

        this._room.AddMessageHandler(MESSAGE.OnResetPlayerDataCache, (message) => 
        {
            this.playersData = [];
        });

        this._room.AddMessageHandler(MESSAGE.OnPlayersDataCacheArrive, (playerData: PlayerDataModel) => 
        {
            this.playersData.push(playerData);
            if(UIManager.instance.currentPanelType == UIPanelType.START)
            {
                UIManager.instance.SetPlayersOnline(this.GetPlayersAmount());
                UIManager.instance.SetPlayersReady(this.GetPlayersReady());
            }
        });

        this._room.AddMessageHandler(MESSAGE.OnAllPlayersCustomized, (value) =>
        {
            UIManager.instance.SwitchUIPanel(UIPanelType.GAME);
            GameManager.instance.SwitchStage(STAGE.RUNWAY);
        });

    }

    private SetInitialPlayerData()
    {
        this.localPlayerData = new PlayerData();
        this.localPlayerData.ownerSessionId = this._room.SessionId;
        this.localPlayerData.wolrdId = WorldService.userId;
        this._room.Send(MESSAGE.RequestPlayersDataCache, "");
    }

    public RequestPlayersDataCache()
    {
        this._room.Send(MESSAGE.RequestPlayersDataCache, "");
    }

    public SendPlayerData()
    {
        const data = new RoomData();
        data.Add("wolrdId", this.localPlayerData.wolrdId);
        data.Add("ownerSessionId", this.localPlayerData.ownerSessionId);
        data.Add("isReady", this.localPlayerData.isReady);
        data.Add("isWinner", this.localPlayerData.isWinner);
        data.Add("isCustomized", this.localPlayerData.isCustomized);
        
        data.Add("headItem", this.localPlayerData.headItem);
        data.Add("chestItem", this.localPlayerData.chestItem);
        data.Add("legsItem", this.localPlayerData.legsItem);
        data.Add("footItem", this.localPlayerData.footItem);

        Debug.LogError("SENDING : " + MESSAGE.SendPlayerData);
        this._room.Send(MESSAGE.SendPlayerData, data.GetObject());
    }

    public SetPlayerIsCustomize(value: bool)
    {
        this.localPlayerData.isCustomized = value;
        this.SendPlayerData();
    }

    public SetItemInPlayerData(itemType: ITEM_TYPE, itemId: string)
    {
        switch (itemType)
        {
            case ITEM_TYPE.HEAD:
                this.localPlayerData.headItem = itemId;
                break;
            case ITEM_TYPE.CHEST:
                this.localPlayerData.chestItem = itemId;
                break;
            case ITEM_TYPE.LEGS:
                this.localPlayerData.legsItem = itemId;
                break;
            case ITEM_TYPE.FOOT:
                this.localPlayerData.footItem = itemId;
                break;
        }
    }

    public SetPlayerReady(value: boolean)
    {
        this.localPlayerData.isReady = value;
        this._room.Send(MESSAGE.SendPlayerReady, value);
    }

    public GetPlayersAmount() : number
    {
        let result = 0;
        result = this.playersData.length;
        return result;
    }

    public GetPlayersReady() : number
    {
        let result = 0;
        this.playersData.forEach(element => {
            if(element.isReady)
            {
                result++;
            }
        });
        return result;
    }

    public GetRoom() : Room
    {
        return this._room;
    }

    public GetState() : State
    {
        return this._room.State;
    }
}

interface PlayerDataModel {
    wolrdId?: string;
    ownerSessionId?: string;
    isReady?: boolean;
    isWinner?: boolean;
    isCustomized?: boolean;

    headItem?: string;
    chestItem?: string;
    legsItem?: string;
    footItem?: string;
}

enum MESSAGE {
    SendPlayerData = "SendPlayerData",
    SendGameStarted = "SendGameStarted",
    SendPlayerReady = "SendPlayerReady",
    RemovePlayerData = "RemovePlayerData",
    RequestPlayersDataCache = "RequestPlayersDataCache",
    OnResetPlayerDataCache = "OnResetPlayerDataCache",
    OnPlayersDataCacheArrive = "OnPlayersDataCacheArrive",
    OnPlayersReady = "OnPlayersReady",
    OnAllPlayersCustomized = "OnAllPlayersCustomized"
}