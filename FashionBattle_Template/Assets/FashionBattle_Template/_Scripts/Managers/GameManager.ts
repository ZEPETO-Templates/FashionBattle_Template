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
import UIPanelTheme from '../UI/UIPanelTheme';

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
  @HideInInspector() public theme: bool = false; // Flag to know if there are theme

  @Header("Settings")
  public timeToStart: number; //Total time to start the game
  @HideInInspector()public counterToStart: number = 10; //Counter used to update when all players are ready
  public voteTimerLimit: number = 10; //Total time for voting
  public customizationTimeLimit: number = 10; //Total time for customization
  public customizationTimeTheme: number = 5; //Total time for theme panel

  // Runway
  @HideInInspector() public currentPlayerIndexInRunway = 0; // This variable saves the current player index in runway
  @HideInInspector() public totalPlayersInRunway = 0; // This variable saves the total players in runway

  private _currentStage: STAGE; // This variable saves the current stage


  public startPanel: GameObject; // Reference to the runway stage
  public themePanel: GameObject; // Reference to the winner stage

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
    // Call the function InitGame
    this.InitGame();
  }

  // Update is called every frame, if the MonoBehaviour is enabled
  Update() 
  {
    // Check if the playersReady value is true and isGameStarted value is false
    if (this.playersReady && !this.isGameStarted) 
    {
      // We subtract 1 real second from the counter
      this.counterToStart -= Time.deltaTime;

      // Check if the counter values is minor of cero
      if (this.counterToStart < 0) 
      {
        // We set the isGameStarted value to true
        this.isGameStarted = true;

        // Set Theme Panel
         this.themePanel.SetActive(true);
         this.startPanel.SetActive(false);
         UIPanelTheme.instance.StartTheme();
      }    
    }
  }
  
public StartCustomization()
{
       // Call the SwitchUIPanel function to switch to the Customization panel
       UIManager.instance.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
       // Call the function SwitchStage
       this.SwitchStage(STAGE.CUSTOMIZATION);
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
    GameManager.instance.theme = false;
    this.themePanel.SetActive(false);
    this.startPanel.SetActive(true);
    this.counterToStart = this.timeToStart;
    this.SwitchStage(STAGE.START);
  }

  //This method is responsible for controlling the stages and panels that are displayed on the screen
  public SwitchStage(stage: STAGE) 
  {
    // We save the current stage
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
        UIManager.instance.ResetStartPanel();
        // And we switch the current UI for start game
        UIManager.instance.SwitchUIPanel(UIPanelType.START);
        break;
      // When current stage is "CUSTOMIZATION"        
      case STAGE.CUSTOMIZATION:

        UIManager.instance.ResetCustomizationPanel();

        MultiplayerManager.instance.ResetPlayerData();
        MultiplayerManager.instance.SendResetVoteCache();
        MultiplayerManager.instance.RequestVoteDataCache();

        // We activate the customization screen        
        this.stageCustomization.SetActive(true);

        PlayerSpawner.instance.ShowCharacterOriginal(
          MultiplayerManager.instance.localPlayerData.ownerSessionId
        );

        PlayerSpawner.instance.ResetPreviewData(
          MultiplayerManager.instance.localPlayerData.ownerSessionId
        );

        break;
      // When current stage is "RUNWAY"         
      case STAGE.RUNWAY:
        // We hide the current player
        PlayerSpawner.instance.HideCurrentZepetoPlayer();
        // We activate the runway screen
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
        // We activate the winner screen
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
      // We upgrade the index
      this.currentPlayerIndexInRunway++;
    }
  }

  //This method is used to return the session identifier of a specific player
  private GetPlayerIdByIndex(index: number): string 
  {
    return MultiplayerManager.instance.playersData[index].ownerSessionId;
  }

  // This method is used to notify the server and change current player in runway
  public OnCurrentVotingFinish() 
  {
    // Call the function SendVotingData
    MultiplayerManager.instance.SendVotingData();
    // Call the function SetNextPlayerInRunway
    this.SetNextPlayerInRunway();
  }

  //This method is used to call the method responsible for changing the player's clothes.
  public SetCharacterWithCloth(index: number) 
  {
    // Call the function ShowCharacterWithCloth with current player index
    PlayerSpawner.instance.ShowCharacterWithCloth(
      MultiplayerManager.instance.playersData[index].ownerSessionId
    );
  }

  // This method is used to set players are ready
  public SetGameReadyToStart(value: bool) 
  {
    //First set the playersReady with the value returns by server
    this.playersReady = value;

    //Call the function SetCounterToStart
    UIManager.instance.SetCounterToStart(value);

    // Check if the value is false
    if (!value) 
    {
      // We set the counters to start game
      this.counterToStart = this.timeToStart;
    }
  }

  public EvaluateAndSetVote() 
  {
     // We obtain the winner's data
    let winnerData: VoteModel = MultiplayerManager.instance.GetWinner();

    // We obtain the winner's name
    let winnerName = ZepetoPlayers.instance.GetPlayer(
      winnerData.sessionId
    ).name;

    // We obtain the winner's score
    let winnerScore = winnerData.finalVote.toString();

    // Check if the current stage is ENDGAME 
    if (this._currentStage == STAGE.ENDGAME) 
    {
      // Call the function HideCurrentZepetoPlayer
      PlayerSpawner.instance.HideCurrentZepetoPlayer();

      // Call the function ShowCharacterWithCloth with winner session id     
      PlayerSpawner.instance.ShowCharacterWithCloth(winnerData.sessionId);

      // Call the function SetWinnerPanelData with winner name and winner score 
      UIManager.instance.SetWinnerPanelData(winnerName, winnerScore);
    }
  }

  // This method is called on game over, responsible to reset game
  private OnGameOver() 
  {
    //Set the isPlayerReady to false
    this.isPlayerReady = false;
    GameManager.instance.theme = false;
    //Call the function OnPlayerDoneCustomize with value false
    this.OnPlayerDoneCustomize(false);
    MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);

    //Call the function SwitchUIPanel with value END
    UIManager.instance.SwitchUIPanel(UIPanelType.END);
  }

  // This method is used to notify the server when the local player is ready
  public OnPlayerReady() 
  {
    // We change the value of ready players to the new value
    this.isPlayerReady = !this.isPlayerReady;

    // Call the function SetPlayerReady
    MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);
  }

  // This method is used to notify the server when the local player is done change customize
  public OnPlayerDoneCustomize(value: boolean) 
  {
    // Call the function SetPlayerIsCustomize
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
