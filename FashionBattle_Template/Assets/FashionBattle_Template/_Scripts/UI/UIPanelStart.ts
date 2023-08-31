import { Debug, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIManager from '../Managers/UIManager';
import { TMP_Text } from 'TMPro';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';

export default class UIPanelStart extends ZepetoScriptBehaviour 
{
    @Header("PANELS")
    @SerializeField() masterPanel: GameObject;
    @SerializeField() othersPanel: GameObject;

    @Header("BUTTONS")
    @SerializeField() startBtn: RoundedRectangleButton; // Reference to the play button
    @SerializeField() readyBtn: RoundedRectangleButton; // Reference to the play button

    @Header("TEXT")
    @SerializeField() playersCountTMP: TMP_Text;
    @SerializeField() playersReadyTMP: TMP_Text;

    Start()
    {
        this.startBtn.OnClick.AddListener(() => {
            UIManager.instance.OnStartButton();
        });

        this.readyBtn.OnClick.AddListener(() => {
            UIManager.instance.OnReadyButton();
        });
    }

    public RefreshPanel()
    {
        if(MultiplayerManager.instance.IsMaster)
        {
            this.SwitchPanels(START_PANEL.MASTER);
        }
        else
        {
            this.SwitchPanels(START_PANEL.OTHER);
        }
    }

    public SwitchPanels(startPanelType: START_PANEL)
    {
        this.masterPanel.SetActive(false);
        this.othersPanel.SetActive(false);

        switch (startPanelType){
            case START_PANEL.MASTER:
                break;
            case START_PANEL.OTHER:
                break;
        }
    }

    public SetPlayersCount(amount: number)
    {
        this.playersCountTMP.text = "Players in Session: " + amount;
    }

    public SetPlayersReady(amount: number)
    {
        this.playersCountTMP.text = "Ready: " + amount;
    }
}

enum START_PANEL
{
    MASTER,
    OTHER
}