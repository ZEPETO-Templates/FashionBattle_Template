import { Debug, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIPanel from '../UI/UIPanel';
import UIPanelStart from '../UI/UIPanelStart';
import UIPanelGame from '../UI/UIPanelGame';
import UIPanelEnd from '../UI/UIPanelEnd';
import UIPanelCustomization from '../UI/UIPanelCustomization';

export enum UIPanelType
{
    START,
    LOBBY,
    GAME,
    CUSTOMIZATION,
    END,
    NONE
}

export default class UIManager extends ZepetoScriptBehaviour
{
    public static instance: UIManager;

    public uiPanelsGameObject: GameObject[];
    private uiPanels: UIPanel[];

    public currentPanelType: UIPanelType = UIPanelType.NONE;

    Awake() {
        // Singleton pattern
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;
    }
    
    public Init() : void
    {
        this.uiPanels = [];
    
        for (var i = 0; i < this.uiPanelsGameObject.length; i++)
        {
            this.uiPanels[i] = this.uiPanelsGameObject[i].GetComponent<UIPanel>();
        }
    }

    public SetNewxtPlayerToVote(playerId: string)
    {
        let gamePanel = this.GetUiPanelType(UIPanelType.GAME).GetComponent<UIPanelGame>();
        gamePanel.SetNextPlayerToVote(playerId);
    }

    public SetWinnerPanelData(winnername: string, winnerscore: string)
    {
        let endPanel = this.GetUiPanelType(UIPanelType.END).GetComponent<UIPanelEnd>();
        endPanel.SetEndPanelData(winnername, winnerscore);
    }

    public SetLoadingPanel(value: bool)
    {
        let customizationPanel = this.GetUiPanelType(UIPanelType.CUSTOMIZATION).GetComponent<UIPanelCustomization>();
        customizationPanel.SetLoadingPanel(value);
    }

    public OnStartButton()
    {
        this.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
    }

    public ResetPanels()
    {
        let customizationPanel = this.GetUiPanelType(UIPanelType.CUSTOMIZATION).GetComponent<UIPanelCustomization>();
        customizationPanel.ResetPanel();

        let startPanel = this.GetUiPanelType(UIPanelType.START).GetComponent<UIPanelStart>();
        startPanel.ResetPanel();
    }

    public SetCounterToStart(value: bool)
    {
        let startPanel = this.GetUiPanelType(UIPanelType.START).GetComponent<UIPanelStart>();
        startPanel.ShowCountdownText(value);
    }
    
    public SetPlayersOnline(value: number)
    {
        let startPanel = this.GetUiPanelType(UIPanelType.START).GetComponent<UIPanelStart>();
        startPanel.SetPlayersCount(value);
    }

    public SetPlayersReady(value: number)
    {
        let startPanel = this.GetUiPanelType(UIPanelType.START).GetComponent<UIPanelStart>();
        startPanel.SetPlayersReady(value);
    }

    public SetReadyButtonInteractable()
    {
        let startPanel = this.GetUiPanelType(UIPanelType.START).GetComponent<UIPanelStart>();
        startPanel.SetReadyButtonInteractable();
    }

    public SwitchUIPanel(uiPanelType: UIPanelType): void
    {
        this.currentPanelType = uiPanelType;

        for (var i = 0; i < this.uiPanels.length; i++)
        {
            if (this.uiPanels[i].uiPanelType == uiPanelType)
            {
                this.uiPanels[i].Show(true);
            }
            else 
            {
                this.uiPanels[i].Show(false);
            }
        }
    }

    private GetUiPanelType(uiPanelType: UIPanelType) : UIPanel
    {
        let result = this.uiPanels[i];  
        for (var i = 0; i < this.uiPanels.length; i++) {
            if (this.uiPanels[i].uiPanelType == uiPanelType) {
                result = this.uiPanels[i];
            }
        }
        return result;
    }
}