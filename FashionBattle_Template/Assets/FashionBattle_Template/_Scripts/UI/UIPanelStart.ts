import { Debug, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIManager from '../Managers/UIManager';
import { TMP_Text } from 'TMPro';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';
import GameManager from '../Managers/GameManager';
import { Button } from 'UnityEngine.UI'
export default class UIPanelStart extends ZepetoScriptBehaviour 
{
    @Header("BUTTONS")
    @SerializeField() readyBtn: Button; // Reference to the play button

    @Header("READY IMG")
    @SerializeField() readyImg: GameObject; // Reference to the ready image

    @Header("TEXT")
    @SerializeField() gameCountdownTMP: TMP_Text; // Reference to the text of the countdown
    @SerializeField() playersCountTMP: TMP_Text; // Reference to the text of the all players
    @SerializeField() playersReadyTMP: TMP_Text; // Reference to the text of the ready players
    
    // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
    Start()
    {
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
            this.gameCountdownTMP.text = "Game Starts in " + intvalue;
        }
    }

    // This method is responsible to reset panel
    public ResetPanel()
    {
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
        this.gameCountdownTMP.gameObject.SetActive(value);
    }

    // This method is responsible to set text of the all players in session by new value
    public SetPlayersCount(amount: number)
    {
        this.playersCountTMP.text = "Players in Session: " + amount;
    }

    // This method is responsible to set text of the all players ready by new value
    public SetPlayersReady(amount: number)
    {
        this.playersReadyTMP.text = "Ready: " + amount;
    }

    public SetReadyButtonInteractable()
    {
        this.readyBtn.interactable = true;
    }
}