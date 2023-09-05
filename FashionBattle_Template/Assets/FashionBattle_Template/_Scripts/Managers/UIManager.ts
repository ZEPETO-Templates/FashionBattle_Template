import { Debug, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIPanel from '../UI/UIPanel';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import CustomDebug from '../../Z_CustomDebug/CustomDebug';
import UIPanelStart from '../UI/UIPanelStart';

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

    Start()
    {
        this.InitUIManager();
    }
    
    public InitUIManager() : void
    {
        this.uiPanels = [];
    
        for (var i = 0; i < this.uiPanelsGameObject.length; i++)
        {
            this.uiPanels[i] = this.uiPanelsGameObject[i].GetComponent<UIPanel>();
        }
    
        this.SwitchUIPanel(UIPanelType.START);
    }

    public OnStartButton()
    {
        this.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
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