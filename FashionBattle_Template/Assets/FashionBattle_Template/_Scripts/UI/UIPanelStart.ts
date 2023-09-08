import { Debug, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIManager from '../Managers/UIManager';
import { TMP_Text } from 'TMPro';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';
import GameManager from '../Managers/GameManager';

export default class UIPanelStart extends ZepetoScriptBehaviour 
{
    @Header("BUTTONS")
    @SerializeField() readyBtn: RoundedRectangleButton; // Reference to the play button

    @Header("READY IMG")
    @SerializeField() readyImg: GameObject;

    @Header("TEXT")
    @SerializeField() gameCountdownTMP: TMP_Text;
    @SerializeField() playersCountTMP: TMP_Text;
    @SerializeField() playersReadyTMP: TMP_Text;

    Start()
    {
        this.readyImg.SetActive(GameManager.instance.isPlayerReady);

        this.readyBtn.OnClick.AddListener(() => {
            GameManager.instance.OnPlayerReady();
            this.readyImg.SetActive(GameManager.instance.isPlayerReady);
        });

        this.readyBtn.interactable = false;

        this.ShowCountdownText(false);
    }

    Update()
    {
        if (GameManager.instance.isPlayerReady && !GameManager.instance.isGameStarted)
        {
            var intvalue = Math.floor(GameManager.instance.counterToStart);
            this.gameCountdownTMP.text = "Game Starts in " + intvalue;
        }
    }

    public ResetPanel()
    {
        this.ShowCountdownText(false);
        this.readyImg.SetActive(GameManager.instance.isPlayerReady);
    }

    public ShowCountdownText(value: bool)
    {
        this.gameCountdownTMP.gameObject.SetActive(value);
    }

    public SetPlayersCount(amount: number)
    {
        this.playersCountTMP.text = "Players in Session: " + amount;
    }

    public SetPlayersReady(amount: number)
    {
        this.playersReadyTMP.text = "Ready: " + amount;
    }

    public SetReadyButtonInteractable()
    {
        this.readyBtn.interactable = true;
    }
}