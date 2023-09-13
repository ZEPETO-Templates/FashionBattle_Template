import { Color, Sprite } from 'UnityEngine';
import { Image } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CustomButton extends ZepetoScriptBehaviour {

    @SerializeField() private iconRef: Image;
    @SerializeField() private defaultColor: Color;
    @SerializeField() private highlightColor: Color;

    public SetCustomButton(iconSprite: Sprite)
    {
        this.iconRef.sprite = iconSprite;
    }

    public SelectButton()
    {
        this.iconRef.color = this.highlightColor;
    }

    public ResetButton()
    {
        this.iconRef.color = this.defaultColor;
    }

}