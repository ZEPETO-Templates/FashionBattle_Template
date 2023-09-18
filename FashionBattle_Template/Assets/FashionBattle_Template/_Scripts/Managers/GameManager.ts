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
  public static instance: GameManager; // Singleton instance variable

  @HideInInspector() public isPlayerReady: bool = false; // Flag to know if all the players are ready

  @Header("Stage References")
  public stageCustomization: GameObject; // Reference to the customization stage
  public stageRunway: GameObject; // Reference to the runway stage
  public stageWinner: GameObject; // Reference to the winner stage

  @HideInInspector() public isGameStarted: bool = false; // Flag to know if the game are started
  @HideInInspector() public playersReady: bool = false; // Flag to know if all the players are ready

  @Header("Settings")
  public timeToStart: number; //Total time to start the game
  public counterToStart: number = 10; //Counter used to update when all players are ready
  public voteTimerLimit: number = 10; //Total time for voting
  public customizationTimeLimit: number = 10; //Total time for customization

  // Runway

  @HideInInspector() public currentPlayerIndexInRunway = 0; // This variable saves the current player index in runway
  @HideInInspector() public totalPlayersInRunway = 0; // This variable saves the total players in runway

  private _currentStage: STAGE; // This variable saves the current stage

  // Awake is called when an enabled script instance is being loaded.
  Awake() 
  {
    // Singleton pattern
    if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
    else GameManager.instance = this;
  }

  // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
  Start() 
  {
    this.InitGame();
  }

  // Update is called every frame, if the MonoBehaviour is enabled
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

  // This method is responsible for starting all systems
  public InitGame() 
  {
    UIManager.instance.Init();

    this.StartGame();
  }

  // This method is responsible for starting the game
  public StartGame() 
  {
    this.isGameStarted = false;
    this.isPlayerReady = false;
    this.counterToStart = this.timeToStart;
    this.SwitchStage(STAGE.START);
  }

  //This method is responsible for controlling the stages and panels that are displayed on the screen
  public SwitchStage(stage: STAGE) 
  {
    // First we save the current stage
    this._currentStage = stage;

    // We disable all stages screens.
    this.stageCustomization.SetActive(false);
    this.stageRunway.SetActive(false);
    this.stageWinner.SetActive(false);

    // Check in the all stages types
    switch (stage) 
    {
      // When current stage is "START"
      case STAGE.START:
        // We reset all panels       
        UIManager.instance.ResetPanels();
        // And we switch the current UI for start game
        UIManager.instance.SwitchUIPanel(UIPanelType.START);
        break;
      // When current stage is "CUSTOMIZATION"        
      case STAGE.CUSTOMIZATION:
        MultiplayerManager.instance.SendResetVoteCache();
        MultiplayerManager.instance.RequestVoteDataCache();

        // We acitvate the custimization screen        
        this.stageCustomization.SetActive(true);

        PlayerSpawner.instance.ShowCharacterOriginal(
          MultiplayerManager.instance.localPlayerData.ownerSessionId
        );
        break;
      // When current stage is "RUNWAY"         
      case STAGE.RUNWAY:
        // We hide the current player
        PlayerSpawner.instance.HideCurrentZepetoPlayer();
        // We acitvate the runway screen
        this.stageRunway.SetActive(true);

        // Set the current player index in 0
        this.currentPlayerIndexInRunway = 0;

        // Set the total players in runway by the all players in game
        this.totalPlayersInRunway =
          MultiplayerManager.instance.playersData.length;
        
        // Call to the function SetNextPlayerInRunway
        this.SetNextPlayerInRunway();
        break;
      // When current stage is "ENDGAME"           
      case STAGE.ENDGAME:
        // We acitvate the winner screen
        this.stageWinner.SetActive(true);
        // Call to the function OnGameOver
        this.OnGameOver();
        break;
    }
  }

  //This method is in charge of restarting the game
  public RestartGame() 
  {
    // We hide the current player
    PlayerSpawner.instance.HideCurrentZepetoPlayer();
    this.SetGameReadyToStart(false);

    // Call to the function StartGame
    this.StartGame();
  }

  //This method is responsible for showing the characters on the runway
  public SetNextPlayerInRunway() 
  {
    MultiplayerManager.instance.RequestVoteDataCache();

    if (this.currentPlayerIndexInRunway != 0) 
    {
      // We hide the current player
      PlayerSpawner.instance.HideCurrentZepetoPlayer();
    }

    if (this.currentPlayerIndexInRunway >= this.totalPlayersInRunway) 
    {
      //If there are no more players to show, the current state ends and goes to finished 
      this.SwitchStage(STAGE.ENDGAME);
    } 
    else 
    {
      //Gets the sessionId by the current Player Index In Runway
      let playerSessionId = this.GetPlayerIdByIndex(this.currentPlayerIndexInRunway);

      //Change the UI for the new player on the Runway
      UIManager.instance.SetNewxtPlayerToVote(playerSessionId);
      UIManager.instance.SetVotingPanel(!ZepetoPlayers.instance.GetPlayer(playerSessionId).isLocalPlayer);

      //Call the method for change player cloth
      this.SetCharacterWithCloth(this.currentPlayerIndexInRunway);
      //Upgrade the index
      this.currentPlayerIndexInRunway++;
    }
  }

  //This method is used to return the session identifier of a specific player
  private GetPlayerIdByIndex(index: number): string 
  {
    return MultiplayerManager.instance.playersData[index].ownerSessionId;
  }

  public OnCurrentVotingFinish() 
  {
    MultiplayerManager.instance.SendVotingData();
    this.SetNextPlayerInRunway();
  }

  //This method is used to call the method responsible for changing the player's clothes.
  public SetCharacterWithCloth(index: number) 
  {
    PlayerSpawner.instance.ShowCharacterWithCloth(
      MultiplayerManager.instance.playersData[index].ownerSessionId
    );
  }

  // This method is used to set players are ready
  public SetGameReadyToStart(value: bool) 
  {
    //First set the playersReady with the value returns by server
    this.playersReady = value;

    //Call the funtion SetCounterToStart
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

  // This method is called on game over, responsible to reset game
  private OnGameOver() 
  {
    //Set the isPlayerReady to false
    this.isPlayerReady = false;

    //Call the function OnPlayerDoneCustomize with value false
    this.OnPlayerDoneCustomize(false);
    MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);

    //Call the function SwitchUIPanel with value END
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
