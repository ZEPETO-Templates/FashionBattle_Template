import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UIPanelType } from '../Managers/UIManager'

export default class UIPanel extends ZepetoScriptBehaviour {

    public uiPanelType: UIPanelType = UIPanelType.NONE;

    Start() {    

    }

    public Show(value: bool): void
    {
        this.gameObject.SetActive(value);
    }

}