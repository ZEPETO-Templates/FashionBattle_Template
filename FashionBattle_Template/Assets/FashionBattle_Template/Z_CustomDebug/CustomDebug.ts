import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import CustomDebugText from './CustomDebugText';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';

export default class CustomDebug extends ZepetoScriptBehaviour 
{
    public static Instance: CustomDebug;

    @Header("References")
    @SerializeField() public debugConsolePanel: GameObject;
    @SerializeField() public debugTextPrefab: GameObject;

    @Header("Buttons")
    @SerializeField() openCloseBtn: RoundedRectangleButton;

    private _textsList: GameObject[];
        
    Start() 
    {    
        if (CustomDebug.Instance != null) GameObject.Destroy(this.gameObject);
        CustomDebug.Instance = this;

        this.openCloseBtn.OnClick.AddListener(() => {
            this.ToggleConsoleOnOff();
        });
    }

    public LogText(text: string) : void
    {
        let newDebugText = GameObject.Instantiate(this.debugTextPrefab) as GameObject;
        newDebugText.transform.parent = this.debugConsolePanel.transform;
        newDebugText.GetComponent<CustomDebugText>().LogText(text);
        this._textsList.push(newDebugText);
    }

    public ToggleConsoleOnOff()
    {
        this.debugConsolePanel.SetActive(!this.debugConsolePanel.activeSelf); 
    }
}