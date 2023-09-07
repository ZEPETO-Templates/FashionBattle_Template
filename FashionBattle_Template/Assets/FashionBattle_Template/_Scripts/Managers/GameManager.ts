import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Debug, GameObject, Input, KeyCode, Time, Transform } from 'UnityEngine';
import MultiplayerManager, { ITEM_TYPE, VoteModel } from '../Multiplayer/MultiplayerManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import UIManager, { UIPanelType } from './UIManager';
import PlayerSpawner from '../Multiplayer/PlayerSpawner';

export enum STAGE {
    START,
    CUSTOMIZATION,
    RUNWAY,
    ENDGAME
}

export default class GameManager extends ZepetoScriptBehaviour 
{
    public static instance: GameManager;

    public isPlayerReady: bool = false;

    public playerCount: number;

    @Header("Stage References")
    public stageCustomization: GameObject;
    public stageRunway: GameObject;
    public stageWinner: GameObject;

    public isGameStarted: bool = false;
    public playersReady: bool = false;
    public timeToStart: number;
    public counterToStart: number = 10;

    // Runway

    public currentPlayerIndexInRunway = 0;
    public totalPlayersInRunway = 0;

    private _winnerId: string;

    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;

        this.InitGame();
    }

    Update()
    {
        if (this.playersReady && !this.isGameStarted)
        {
            this.counterToStart -= Time.deltaTime;
            if(this.counterToStart < 0)
            {
                this.isGameStarted = true;
                UIManager.instance.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
                this.SwitchStage(STAGE.CUSTOMIZATION);
            }
        }
    }

    public InitGame()
    {
        UIManager.instance.Init();

        this.StartGame();
    }
    
    public StartGame()
    {
        this.SwitchStage(STAGE.START);
        this.isPlayerReady = false;
        this.counterToStart = this.timeToStart;
    }
    
    public SwitchStage(stage: STAGE)
    {
        this.stageCustomization.SetActive(false);
        this.stageRunway.SetActive(false);
        this.stageWinner.SetActive(false);
        
        switch (stage)
        {
            case STAGE.START:
                UIManager.instance.SwitchUIPanel(UIPanelType.START);
                break;
            case STAGE.CUSTOMIZATION:
                this.stageCustomization.SetActive(true);
                PlayerSpawner.instance.ShowCharacterOriginal(MultiplayerManager.instance.localPlayerData.ownerSessionId);
                break;
            case STAGE.RUNWAY:
                PlayerSpawner.instance.HideCharacter(MultiplayerManager.instance.localPlayerData.ownerSessionId);
                this.stageRunway.SetActive(true);
                
                this.currentPlayerIndexInRunway = 0;
                this.totalPlayersInRunway = MultiplayerManager.instance.playersData.length;
                this.SetNextPlayerInRunway();
                break;
            case STAGE.ENDGAME:
                this.stageWinner.SetActive(true);
                this.OnGameOver();
                break;
        }
    }

    public RestartGame()
    {
        PlayerSpawner.instance.HideCharacter(this._winnerId);
        this.SetGameReadyToStart(false);
        this.isGameStarted = false;
        this.StartGame();
    }
    
    public SetNextPlayerInRunway()
    {
        if (this.currentPlayerIndexInRunway >= this.totalPlayersInRunway)
        {
            this.SwitchStage(STAGE.ENDGAME);
        }
        else
        {
            if (this.currentPlayerIndexInRunway != 0){
                PlayerSpawner.instance.HideCharacter(MultiplayerManager.instance.playersData[this.currentPlayerIndexInRunway-1].ownerSessionId);
            }

            UIManager.instance.SetNewxtPlayerToVote(this.GetPlayerIdByIndex(this.currentPlayerIndexInRunway));

            this.SetCharacterWithCloth(this.currentPlayerIndexInRunway);
            this.currentPlayerIndexInRunway++;
        }
    }

    private GetPlayerIdByIndex(index: number) : string
    {
        return MultiplayerManager.instance.playersData[index].ownerSessionId;
    }

    public OnCurrentVotingFinish()
    {
        MultiplayerManager.instance.SendVotingData();
        this.SetNextPlayerInRunway();
    }

    public SetCharacterWithCloth(index: number)
    {
        PlayerSpawner.instance.ShowCharacterWithCloth(MultiplayerManager.instance.playersData[index].ownerSessionId);
    }

    public SetGameReadyToStart(value: bool)
    {
        this.playersReady = value;
        UIManager.instance.SetCounterToStart(value);
        if(!value)
        {
            this.counterToStart = this.timeToStart;
        }
    }

    public EvaluateAndSetVote()
    {
        let winnerData : VoteModel = MultiplayerManager.instance.GetWinner();
        this._winnerId = winnerData.sessionId;

        let winnerName = winnerData.sessionId;
        let winnerScore = winnerData.finalVote.toString();

        UIManager.instance.SetWinnerPanelData(winnerName, winnerScore);
    }

    private OnGameOver()
    {
        MultiplayerManager.instance.RequestVoteDataCache();
        UIManager.instance.SwitchUIPanel(UIPanelType.END);
    }

    public OnPlayerReady()
    {
        this.isPlayerReady = !this.isPlayerReady;
        MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);
    }

    public OnPlayerDoneCustomize()
    {
        MultiplayerManager.instance.SetPlayerIsCustomize(true);
    }

    // Method to change the costume of the local player using the provided item code.
    public ChangeCostume(itemType: ITEM_TYPE ,itemCode: string) {
        // Use the LocalPlayer property to access the local player instance and set their costume using the provided item code.
        ZepetoPlayers.instance.LocalPlayer.SetCostume(itemCode, () => {
            // Once the costume change is complete, log a message indicating the successful change.
            console.log(`Set Costume Complete : ${itemCode}`);
        });

        MultiplayerManager.instance.SetItemInPlayerData(itemType, itemCode);
    }
}