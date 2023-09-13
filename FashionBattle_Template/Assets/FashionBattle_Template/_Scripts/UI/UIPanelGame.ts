import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { ZepetoPlayers } from "ZEPETO.Character.Controller";
import { RoundedRectangleButton } from "ZEPETO.World.Gui";
import VoteButton from "./VoteButton";
import { Debug, Time } from "UnityEngine";
import MultiplayerManager from "../Multiplayer/MultiplayerManager";
import { TMP_Text } from "TMPro";
import GameManager from "../Managers/GameManager";
import { Slider } from "UnityEngine.UI";

export default class UIPanelGame extends ZepetoScriptBehaviour 
{
  @HideInInspector() public currentPlayerIdShowed: string;
  public voteButtons: RoundedRectangleButton[];

  public timeSlider: Slider;
  public playerNameTxt: TMP_Text;

  @HideInInspector() public isTimerRunning: boolean = true;
  @HideInInspector() public voteTimerCounter: number = 0;

  Start() 
  {
    this.timeSlider.maxValue = GameManager.instance.voteTimerLimit;
  }

  Update() 
  {
    if (this.isTimerRunning) 
    {
      this.voteTimerCounter -= Time.deltaTime;
      this.timeSlider.value = this.voteTimerCounter;

      if (this.voteTimerCounter <= 0) 
      {
        this.isTimerRunning = false;
        this.timeSlider.value = 0;
        this.OnFinishVoting();
      }
    }
  }

  public SetNextPlayerToVote(playerId: string) 
  {
    this.currentPlayerIdShowed = playerId;
    this.playerNameTxt.text = ZepetoPlayers.instance.GetPlayer(playerId).name; // Change by PlayerName
    this.isTimerRunning = true;
    this.voteTimerCounter = GameManager.instance.voteTimerLimit;

    // Default Vote
    this.SetVoteSelection(0);
  }

  public SetVoteSelection(voteIndex: number) 
  {
    Debug.LogError("SetVoteSelection: " + voteIndex);
    this.voteButtons.forEach((element) => 
    {
      let voteButton = element.GetComponent<VoteButton>();
      if (voteButton.buttonIndex <= voteIndex) 
      {
        voteButton.SetSelectedImg(true);
      } else 
      {
        voteButton.SetSelectedImg(false);
      }
    });

    this.OnVoteSelection(voteIndex);
  }

  public OnVoteSelection(voteIndex: number) 
  {
    MultiplayerManager.instance.SetVotingData(
      voteIndex,
      this.currentPlayerIdShowed
    );
  }

  public OnFinishVoting() 
  {
    Debug.LogError("OnFinishVoting");
    GameManager.instance.OnCurrentVotingFinish();
  }
}
