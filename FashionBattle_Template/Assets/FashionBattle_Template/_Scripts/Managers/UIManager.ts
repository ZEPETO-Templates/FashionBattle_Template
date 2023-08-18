import { Debug, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIPanel from '../UI/UIPanel';

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

    Start()
    {
        this.uiPanels = [];

        for (var i = 0; i < this.uiPanelsGameObject.length; i++)
        {
            this.uiPanels[i] = this.uiPanelsGameObject[i].GetComponent<UIPanel>();
        }

        this.SwitchUIPanel(UIPanelType.START);
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