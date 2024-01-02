import { Debug, GameObject, Input, KeyCode, Time, Transform } from 'UnityEngine';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WorldService, ZepetoWorldMultiplay } from 'ZEPETO.World';
import PlayerData from './PlayerData';
import GameManager, { STAGE } from '../Managers/GameManager';
import UIManager, { UIPanelType } from '../Managers/UIManager';
import { State } from 'ZEPETO.Multiplay.Schema';
import PlayerSpawner from './PlayerSpawner';

export enum ITEM_TYPE 
{
    HEAD,
    CHEST,
    LEGS,
    FOOT
}

export default class MultiplayerManager extends ZepetoScriptBehaviour 
{

    public static instance: MultiplayerManager;

    public multiplay: ZepetoWorldMultiplay;

    public localPlayerData: PlayerData;
    public localVoteData: VoteModel;

    public playersData: PlayerDataModel[] = [];
    public voteDatas: VoteModel[] = [];

    @HideInInspector() public currentChatacterVoteId: string;
    @HideInInspector() public currentVoteValue: number;

    @HideInInspector() public allPlayersReady: bool = false;

    private _room: Room;

    @Header("Themes")
    public themeText: string[] = []; // This variable saves all themes
    @HideInInspector() public theme: string;

    private currentTheme: number = 0;

    Awake() 
    {
        // Singleton pattern
        if (MultiplayerManager.instance != null) GameObject.Destroy(this.gameObject);
        else MultiplayerManager.instance = this;

        this.SetInitialPlayerData();
    }

    Start() 
    {
        if (!this.multiplay)
            this.multiplay = this.GetComponent<ZepetoWorldMultiplay>();
        if (!this.multiplay) console.warn("Add ZepetoWorldMultiplay First");
        this.multiplay.RoomJoined += (room: Room) => 
        {
            this._room = room;
            this._room.OnStateChange += this.OnStateChange;
            this.AddMessageHandlers();

            this.localPlayerData.ownerSessionId = this._room.SessionId;
            this.SetPlayerReady(this.localPlayerData.isReady);
            this._room.Send(MESSAGE.RequestPlayersDataCache, "");
            this.GetThemeName();
        }
    }

    private OnStateChange(state: State, isFirst: boolean) 
    {
        PlayerSpawner.instance.OnStateChange(state, isFirst);
    }

    private AddMessageHandlers() 
    {

        // PLAYER MESSAGE HANDLERS

        this._room.AddMessageHandler(MESSAGE.OnPlayersReady, (value: string) => 
        {
            if (value == "True") 
            {
                this.allPlayersReady = true;
            }
            else if (value == "False") 
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
            if (UIManager.instance.currentPanelType == UIPanelType.START) 
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

        // VOTE MESSAGE HANDLERS

        this._room.AddMessageHandler(MESSAGE.OnResetVoteCache, (message) => 
        {
            this.voteDatas = [];
        });

        this._room.AddMessageHandler(MESSAGE.OnVoteCacheArrive, (voteData: VoteModel) => 
        {
            this.voteDatas.push(voteData);
            if (this.voteDatas.length == this.playersData.length) 
            {
                GameManager.instance.EvaluateAndSetVote();
            }
        });

        // THEME MESSAGE HANDLERS

        this._room.AddMessageHandler(MESSAGE.OnThemeArrive, (message: string) => 
        {
           this.currentTheme = parseInt(message) - 1 ;
           Debug.Log("ON THEME ARRIVE : " + this.currentTheme);
        });

    }

    private SetInitialPlayerData() 
    {
        this.localPlayerData = new PlayerData();

        this.localPlayerData.isReady = false;
        this.localPlayerData.isWinner = false;
        this.localPlayerData.isCustomized = false;

        this.localPlayerData.headItem = "";
        this.localPlayerData.chestItem = "";
        this.localPlayerData.legsItem = "";
        this.localPlayerData.footItem = "";
    }

    public RequestPlayersDataCache() 
    {
        this._room.Send(MESSAGE.RequestPlayersDataCache, "");
    }

    public SendResetVoteCache() 
    {
        this._room.Send(MESSAGE.SendResetVoteData, "");
    }

    public RequestVoteDataCache() 
    {
        this._room.Send(MESSAGE.RequestVoteDataCache, "");
    }

    public SendPlayerData() 
    {
        const data = new RoomData();
        data.Add("ownerSessionId", this.localPlayerData.ownerSessionId);
        data.Add("isReady", this.localPlayerData.isReady);
        data.Add("isWinner", this.localPlayerData.isWinner);
        data.Add("isCustomized", this.localPlayerData.isCustomized);

        data.Add("headItem", this.localPlayerData.headItem);
        data.Add("chestItem", this.localPlayerData.chestItem);
        data.Add("legsItem", this.localPlayerData.legsItem);
        data.Add("footItem", this.localPlayerData.footItem);

        this._room.Send(MESSAGE.SendPlayerData, data.GetObject());
    }

    public ResetPlayerData()
    {
        this.localPlayerData.isReady = false;
        this.localPlayerData.isWinner = false;
        this.localPlayerData.isCustomized = false;

        this.localPlayerData.headItem = "";
        this.localPlayerData.chestItem = "";
        this.localPlayerData.legsItem = "";
        this.localPlayerData.footItem = "";

        this.SendPlayerData();
    }

    public SetVotingData(voteValue: number, characterIdVoted: string) 
    {
        this.currentChatacterVoteId = characterIdVoted;
        this.currentVoteValue = voteValue;
    }

    public SendVotingData() 
    {
        if(this.currentChatacterVoteId != this.localPlayerData.ownerSessionId)
        {
            const data = new RoomData();
            data.Add("sessionId", this.currentChatacterVoteId);
            data.Add("voteValue", this.currentVoteValue);
            this._room.Send(MESSAGE.SendVoteData, data.GetObject());
        }
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

    public GetPlayerData(sessionId: string): PlayerDataModel 
    {
        let result = this.playersData[0];
        this.playersData.forEach((pd) => 
        {
            if (pd.ownerSessionId == sessionId) 
            {
                result = pd;
            }
        });
        return result;
    }

    public GetPlayersAmount(): number 
    {
        let result = 0;
        result = this.playersData.length;
        return result;
    }

    public GetPlayersReady(): number 
    {
        let result = 0;
        this.playersData.forEach(element => 
            {
            if (element.isReady) 
            {
                result++;
            }
        });
        return result;
    }

    public GetRoom(): Room 
    {
        return this._room;
    }

    public GetState(): State 
    {
        return this._room.State;
    }

    public GetWinner(): VoteModel[] 
    {
        let winners: VoteModel[] = [];
        winners[0] = this.voteDatas[0];
        this.voteDatas.forEach(vd => 
            {
            vd.finalVote = vd.totalVote / (this.GetPlayersAmount() - 1);

            if (vd.finalVote > winners[0].finalVote) 
            {
                winners[0] = vd;
            }
        });

        this.voteDatas.forEach(vd => 
            {
            vd.finalVote = vd.totalVote / (this.GetPlayersAmount() - 1);

            let anotherWinner = 0;
            if ((vd.finalVote == winners[0].finalVote) && (vd != winners[0])) 
            {
                anotherWinner++;
                winners[anotherWinner] = vd;
            }
        });

        return winners;
    }

    public GetThemeName(): string 
    {
        return this.themeText[this.currentTheme];
    }

    public RequestNextTheme()
    {
        if(this._room != null) {
            Debug.Log("Request Next Theme");
            this._room.Send(MESSAGE.RequestTheme, "");
        }
    }
}

export interface PlayerDataModel 
{
    ownerSessionId?: string;
    isReady?: boolean;
    isWinner?: boolean;
    isCustomized?: boolean;

    headItem?: string;
    chestItem?: string;
    legsItem?: string;
    footItem?: string;
}

export interface VoteModel 
{
    sessionId?: string;
    totalVote?: number;
    finalVote?: number;
}

enum MESSAGE 
{
    SendPlayerData = "SendPlayerData",
    SendGameStarted = "SendGameStarted",
    SendPlayerReady = "SendPlayerReady",
    RemovePlayerData = "RemovePlayerData",
    RequestPlayersDataCache = "RequestPlayersDataCache",
    OnResetPlayerDataCache = "OnResetPlayerDataCache",
    OnPlayersDataCacheArrive = "OnPlayersDataCacheArrive",
    OnPlayersReady = "OnPlayersReady",
    OnAllPlayersCustomized = "OnAllPlayersCustomized",

    SendVoteData = "SendVoteData",
    SendResetVoteData = "SendResetVoteData",
    OnResetVoteCache = "OnResetVoteCache",
    OnVoteCacheArrive = "OnVoteCacheArrive",
    RequestVoteDataCache = "RequestVoteDataCache",

    RequestTheme = "RequestTheme",
    OnThemeArrive = "OnThemeArrive",
}