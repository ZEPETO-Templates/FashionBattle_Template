import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { ZepetoPlayers } from "ZEPETO.Character.Controller";
import { RoundedRectangleButton, ZepetoText } from "ZEPETO.World.Gui";
import VoteButton from "./VoteButton";
import { Debug, GameObject, Time } from "UnityEngine";
import MultiplayerManager from "../Multiplayer/MultiplayerManager";
import { TMP_Text } from "TMPro";
import GameManager from "../Managers/GameManager";
import { Slider, Button } from "UnityEngine.UI";

// This class controls the view of the game panel
export default class UIPanelGame extends ZepetoScriptBehaviour 
{
  @HideInInspector() public currentPlayerIdShowed: string; // The ID of the current player displayed on the screen

  @Header("Vote Buttons")
  public voteButtons: Button[];// An array of voting buttons.

   @Header("Time Slider")
  public timeSlider: Slider; // The time slider control in the panel.

    @Header("Player Name Txt")
  public playerNameTxt: ZepetoText; // The text displaying the player's name.

  public votingPanel: GameObject;

  private _isLocalPlayerVoting: bool = false;

  @HideInInspector() public isTimerRunning: boolean = true; // Indicate whether the timer is currently running.
  @HideInInspector() public voteTimerCounter: number = 0; // A counter for the voting timer.

  // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
  Start() 
  {
    // Set the maximum value of the time slider to the vote timer limit defined in GameManager.
    this.timeSlider.maxValue = GameManager.instance.voteTimerLimit;
  }

  // Update is called every frame, if the MonoBehaviour is enabled
  Update() 
  {
    if (this.isTimerRunning) // Check if the voting timer is currently running.
    {
     // Decrease the vote timer counter by the elapsed time since the last frame.
      this.voteTimerCounter -= Time.deltaTime;

      // Update the time slider's value to reflect the remaining time.
      this.timeSlider.value = this.voteTimerCounter;

         // Check if the voting timer is <= zero.
      if (this.voteTimerCounter <= 0) 
      {
        this.isTimerRunning = false; // Stop the timer
        this.timeSlider.value = 0; // Set the time slider's value to zero.
        this.OnFinishVoting();  // Call the method to handle finishing the voting process.
      }
    }
  }

  // This method is used to update to next player to vote
  public SetNextPlayerToVote(playerId: string) 
  {
   // Update the ID of the current player to be displayed.
    this.currentPlayerIdShowed = playerId;

     // Set the player's name in the UI text element.
    this.playerNameTxt.text = ZepetoPlayers.instance.GetPlayer(playerId).name; // Change by PlayerName

     // Start the voting timer.
    this.isTimerRunning = true;

     //The vote timer counter to the maximum vote timer limit.
    this.voteTimerCounter = GameManager.instance.voteTimerLimit;

    // Default Vote
    this.SetVoteSelection(0);
  }

  // This method is used to show or hide stars in voting panel
  public SetVoteSelection(voteIndex: number) 
  {
    this.voteButtons.forEach((element) => 
    {
      // We obtain the VoteButton component
      let voteButton = element.GetComponent<VoteButton>();

      // Check if button index is same or minor of vote index value
      if (voteButton.buttonIndex <= voteIndex) 
      {
        //If correct, show a star
        voteButton.SetSelectedImg(true);
      } else 
      {
        //If not a correct, hide a star
        voteButton.SetSelectedImg(false);
      }
    });

    // Call the function OnVoteSelection with vote index value
    this.OnVoteSelection(voteIndex);
  }

   // This method pass the selected vote index and the current player's ID to the multiplayer manager for voting data.
  public OnVoteSelection(voteIndex: number) 
  {
    if(!this._isLocalPlayerVoting)
    {
      MultiplayerManager.instance.SetVotingData(
        voteIndex,
        this.currentPlayerIdShowed
      );
    }
  }

  // This method is used to show or hide the voting panel
  public SetVotingPanel(value: bool)
  {
    this._isLocalPlayerVoting = !value;
    this.votingPanel.SetActive(value);
  }

  // This method is called on finish voting
  public OnFinishVoting() 
  {
    // Call the function OnCurrentVotingFinish
    GameManager.instance.OnCurrentVotingFinish();
  }
}
