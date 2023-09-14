import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UIPanelType } from '../Managers/UIManager'

// This class controls the view of the UI panel
export default class UIPanel extends ZepetoScriptBehaviour 
{
    public uiPanelType: UIPanelType = UIPanelType.NONE;    // The type of UI panel reference

    // Show or hide the UI panel.
    public Show(value: bool): void
    {
     // Set the visibility of the GameObject
        this.gameObject.SetActive(value);
    }
}