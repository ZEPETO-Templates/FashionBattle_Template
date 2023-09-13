/** @format */

import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import {
  Debug,
  GameObject,
  Input,
  KeyCode,
  Time,
  Transform,
} from "UnityEngine";
import MultiplayerManager, {
  ITEM_TYPE,
  VoteModel,
} from "../Multiplayer/MultiplayerManager";
import { ZepetoPlayers } from "ZEPETO.Character.Controller";
import UIManager, { UIPanelType } from "./UIManager";
import PlayerSpawner from "../Multiplayer/PlayerSpawner";

export enum STAGE 
{
  START,
  CUSTOMIZATION,
  RUNWAY,
  ENDGAME,
}

export default class GameManager extends ZepetoScriptBehaviour 
{
  public static instance: GameManager;

  @HideInInspector() public isPlayerReady: bool = false;

  @HideInInspector() public playerCount: number;

  @Header("Stage References")
  public stageCustomization: GameObject;
  public stageRunway: GameObject;
  public stageWinner: GameObject;

  @HideInInspector() public isGameStarted: bool = false;
  @HideInInspector() public playersReady: bool = false;

  @Header("Settings")
  public timeToStart: number;
  public counterToStart: number = 10;
  public voteTimerLimit: number = 10;
  public customizationTimeLimit: number = 10;

  // Runway

  @HideInInspector() public currentPlayerIndexInRunway = 0;
  @HideInInspector() public totalPlayersInRunway = 0;

  private _currentStage: STAGE;

  Awake() 
  {
    // Singleton pattern
    if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
    else GameManager.instance = this;
  }

  Start() 
  {
    this.InitGame();
  }

  Update() 
  {
    if (this.playersReady && !this.isGameStarted) 
    {
      this.counterToStart -= Time.deltaTime;
      if (this.counterToStart < 0) 
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
    this.isGameStarted = false;
    this.isPlayerReady = false;
    this.counterToStart = this.timeToStart;
    this.SwitchStage(STAGE.START);
  }

  public SwitchStage(stage: STAGE) 
  {
    this._currentStage = stage;

    this.stageCustomization.SetActive(false);
    this.stageRunway.SetActive(false);
    this.stageWinner.SetActive(false);

    switch (stage) 
    {
      case STAGE.START:
        UIManager.instance.ResetPanels();
        UIManager.instance.SwitchUIPanel(UIPanelType.START);
        break;
      case STAGE.CUSTOMIZATION:
        MultiplayerManager.instance.SendResetVoteCache();
        MultiplayerManager.instance.RequestVoteDataCache();
        this.stageCustomization.SetActive(true);
        PlayerSpawner.instance.ShowCharacterOriginal(
          MultiplayerManager.instance.localPlayerData.ownerSessionId
        );
        break;
      case STAGE.RUNWAY:
        PlayerSpawner.instance.HideCurrentZepetoPlayer();
        this.stageRunway.SetActive(true);

        this.currentPlayerIndexInRunway = 0;
        this.totalPlayersInRunway =
          MultiplayerManager.instance.playersData.length;
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
    PlayerSpawner.instance.HideCurrentZepetoPlayer();
    this.SetGameReadyToStart(false);
    this.StartGame();
  }

  public SetNextPlayerInRunway() 
  {
    MultiplayerManager.instance.RequestVoteDataCache();

    if (this.currentPlayerIndexInRunway != 0) 
    {
      PlayerSpawner.instance.HideCurrentZepetoPlayer();
    }

    if (this.currentPlayerIndexInRunway >= this.totalPlayersInRunway) 
    {
      this.SwitchStage(STAGE.ENDGAME);
    } else 
    {
      UIManager.instance.SetNewxtPlayerToVote(
        this.GetPlayerIdByIndex(this.currentPlayerIndexInRunway)
      );

      this.SetCharacterWithCloth(this.currentPlayerIndexInRunway);
      this.currentPlayerIndexInRunway++;
    }
  }

  private GetPlayerIdByIndex(index: number): string 
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
    PlayerSpawner.instance.ShowCharacterWithCloth(
      MultiplayerManager.instance.playersData[index].ownerSessionId
    );
  }

  public SetGameReadyToStart(value: bool) 
  {
    this.playersReady = value;
    UIManager.instance.SetCounterToStart(value);
    if (!value) 
    {
      this.counterToStart = this.timeToStart;
    }
  }

  public EvaluateAndSetVote() 
  {
    let winnerData: VoteModel = MultiplayerManager.instance.GetWinner();

    let winnerName = ZepetoPlayers.instance.GetPlayer(
      winnerData.sessionId
    ).name;
    let winnerScore = winnerData.finalVote.toString();

    if (this._currentStage == STAGE.ENDGAME) 
    {
      PlayerSpawner.instance.HideCurrentZepetoPlayer();

      PlayerSpawner.instance.ShowCharacterWithCloth(winnerData.sessionId);
      UIManager.instance.SetWinnerPanelData(winnerName, winnerScore);
    }
  }

  private OnGameOver() 
  {
    this.isPlayerReady = false;
    this.OnPlayerDoneCustomize(false);
    MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);
    UIManager.instance.SwitchUIPanel(UIPanelType.END);
  }

  public OnPlayerReady() 
  {
    this.isPlayerReady = !this.isPlayerReady;
    MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);
  }

  public OnPlayerDoneCustomize(value: boolean) 
  {
    MultiplayerManager.instance.SetPlayerIsCustomize(value);
  }

  // Method to change the costume of the local player using the provided item code.
  public ChangeCostume(itemType: ITEM_TYPE, itemCode: string) 
  {
    // Use the LocalPlayer property to access the local player instance and set their costume using the provided item code.

    UIManager.instance.SetLoadingPanel(true);

    ZepetoPlayers.instance.LocalPlayer.SetCostume(itemCode, () => 
    {
      // Once the costume change is complete, log a message indicating the successful change.
      console.log(`Set Costume Complete : $
      {itemCode}`);

      UIManager.instance.SetLoadingPanel(false);
    });

    MultiplayerManager.instance.SetItemInPlayerData(itemType, itemCode);
  }
}
