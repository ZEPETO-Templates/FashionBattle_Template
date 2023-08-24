import { TextMeshProUGUI } from 'TMPro';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CustomDebugText extends ZepetoScriptBehaviour {

    public debugText: TextMeshProUGUI;

    public LogText(txt : string)
    {
        this.debugText.text = txt;
    }

}