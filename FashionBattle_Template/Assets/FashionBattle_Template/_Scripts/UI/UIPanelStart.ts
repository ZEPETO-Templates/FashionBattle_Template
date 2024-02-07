import { Debug, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoText, RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIManager from '../Managers/UIManager';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';
import GameManager from '../Managers/GameManager';
import { Button } from 'UnityEngine.UI'

export default class UIPanelStart extends ZepetoScriptBehaviour 
{
    public static instance: UIPanelStart; // Singleton instance variable
    @Header("BUTTONS")
    @SerializeField() readyBtn: Button; // Reference to the play button
    @SerializeField() readyBtns: GameObject; // Reference to the play button
    @Header("READY IMG")
    @SerializeField() readyImg: GameObject; // Reference to the ready image

    @Header("TEXT")
    @SerializeField() gameCountdownTxt: ZepetoText; // Reference to the text of the countdown
    @SerializeField() playersCountTxt: ZepetoText; // Reference to the text of the all players
    @SerializeField() playersReadyTxt: ZepetoText; // Reference to the text of the ready players

    @Header("OTHER")
    @SerializeField() countdownBg: GameObject; // Reference to the Countdown Background

    // Awake is called when an enabled script instance is being loaded.
    Awake() 
    {
      // Singleton pattern
      if (UIPanelStart.instance != null) GameObject.Destroy(this.gameObject);
      else UIPanelStart.instance = this;
    }
   
    // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
    Start()
    {
        this.readyBtns.SetActive(true);
        // Change the ready image value by the GameManager reference
        this.readyImg.SetActive(GameManager.instance.isPlayerReady);

        // Add action on click the main button
        this.readyBtn.onClick.AddListener( () => {
            this.OnClick();
        } );
    
        // Set interactable button to false
        this.readyBtn.interactable = false;

        // Call to the function ShowCountdownText with value false
        this.ShowCountdownText(false);
    }



    OnClick (): void { 
        // Call to the function OnPlayerReady
        GameManager.instance.OnPlayerReady();

        // Change the ready image value by the GameManager reference
        this.readyImg.SetActive(GameManager.instance.isPlayerReady);
     }

    // Update is called every frame, if the MonoBehaviour is enabled
    Update()
    {
        if (GameManager.instance.isPlayerReady && !GameManager.instance.isGameStarted)
        {
            var intvalue = Math.floor(GameManager.instance.counterToStart);
            this.gameCountdownTxt.text = "Game Starts in " + intvalue;
        }
    }

    // This method is responsible to reset panel
    public ResetPanel()
    {
        this.readyBtns.SetActive(true);
        // Call to the function ShowCountdownText with value false
        this.ShowCountdownText(false);
        // Change the ready image value by the GameManager reference        
        this.readyImg.SetActive(GameManager.instance.isPlayerReady);
        // Call to the function SetPlayersReady with value 0        
        this.SetPlayersReady(0);
    }

    // This method is responsible to change state on countdown object
    public ShowCountdownText(value: bool)
    {
        this.gameCountdownTxt.gameObject.SetActive(value);
        this.countdownBg.gameObject.SetActive(value);
    }

    // This method is responsible to set text of the all players in session by new value
    public SetPlayersCount(amount: number)
    {
        this.playersCountTxt.text = "Players in Session: " + amount;
    }

    // This method is responsible to set text of the all players ready by new value
    public SetPlayersReady(amount: number)
    {
        this.playersReadyTxt.text = "Ready: " + amount;
    }

    public SetReadyButtonInteractable()
    {
        this.readyBtn.interactable = true;
    }

    public SetReadyButtonOff()
    {
        this.readyBtns.SetActive(false);
    }
}