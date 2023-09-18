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
    public static instance: UIManager; // Singleton instance variable

    public uiPanelsGameObject: GameObject[]; // Reference to all panels in scene
    private uiPanels: UIPanel[]; // Reference to save all UIPanel scripts

    @HideInInspector() public currentPanelType: UIPanelType = UIPanelType.NONE; // This variable saves the current panel type

    // Awake is called when an enabled script instance is being loaded.
    Awake() 
    {
        // Singleton pattern
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;
    }

    // This method is responsible for starting all systems
    public Init(): void 
    {
        this.uiPanels = []; //First start the array

        for (var i = 0; i < this.uiPanelsGameObject.length; i++) 
        {
            //Then, get the reference of the scripts of each panel in the scene
            this.uiPanels[i] = this.uiPanelsGameObject[i].GetComponent<UIPanel>();
        }
    }

    //This method is used to update the next player to vote
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

    public SetVotingPanel(value: bool) 
    {
        let gamePanel = this.GetUiPanelType(UIPanelType.GAME).GetComponent<UIPanelGame>();
        gamePanel.SetVotingPanel(value);
    }

    public OnStartButton() 
    {
        this.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
    }

    //This method reset all panels
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

    //This method controls the visual panels, recive the UIPanelType and find it in all panels for activate.
    public SwitchUIPanel(uiPanelType: UIPanelType): void 
    {
        //We change the current panel type for the new one
        this.currentPanelType = uiPanelType;

        //We go through all the references of the ui panels
        for (var i = 0; i < this.uiPanels.length; i++) 
        {
            //Check if the type in "i" is the same as the new one
            if (this.uiPanels[i].uiPanelType == uiPanelType) 
            {
                //If it is correct, activate the panel with the corresponding type
                this.uiPanels[i].Show(true);
            }
            else 
            {
                //If it is not correct, deactivate the panel
                this.uiPanels[i].Show(false);
            }
        }
    }

    //This method returns a panel with the correct UIPanel type
    private GetUiPanelType(uiPanelType: UIPanelType): UIPanel 
    {
        let result = this.uiPanels[i];
        for (var i = 0; i < this.uiPanels.length; i++) 
        {
            if (this.uiPanels[i].uiPanelType == uiPanelType) 
            {
                result = this.uiPanels[i];
            }
        }
        return result;
    }
}