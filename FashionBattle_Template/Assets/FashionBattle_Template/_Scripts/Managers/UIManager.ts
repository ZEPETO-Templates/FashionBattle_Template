import { Debug, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIPanel from '../UI/UIPanel';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import CustomDebug from '../CustomDebug/CustomDebug';

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
    public uiPanelsGameObject: GameObject[];
    private uiPanels: UIPanel[];

    @Header("Buttons")
    @SerializeField() startBtn: RoundedRectangleButton; // Reference to the Start button

    Start()
    {
        this.InitUIManager();
    }
    
    public InitUIManager() : void
    {
        this.startBtn.OnClick.AddListener(() => { this.OnStartButton(); });
        
        this.uiPanels = [];
    
        for (var i = 0; i < this.uiPanelsGameObject.length; i++)
        {
            this.uiPanels[i] = this.uiPanelsGameObject[i].GetComponent<UIPanel>();
        }
    
        this.SwitchUIPanel(UIPanelType.START);
    }

    public OnStartButton()
    {
        if (CustomDebug.Instance != null) {
            CustomDebug.Instance.LogText("- - - ON START BUTTON - - -");
            Debug.LogError("- - - ON START BUTTON - - -");
        }
    }

    public SwitchUIPanel(uiPanelType: UIPanelType): void
    {
        for (var i = 0; i < this.uiPanels.length; i++)
        {
            if (this.uiPanels[i].uiPanelType == uiPanelType)
            {
                this.uiPanels[i].Show(true);
            }
            else {
                this.uiPanels[i].Show(false);
            }
        }
    }
}