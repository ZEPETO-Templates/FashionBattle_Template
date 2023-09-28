import { Color, Sprite } from 'UnityEngine';
import { Image } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CustomButton extends ZepetoScriptBehaviour {

    @SerializeField() private iconRef: Image; // Reference to the icon
    @SerializeField() private defaultColor: Color; // Reference to the default color
    @SerializeField() private highlightColor: Color; // Reference to the hightlight color

    // This method is responsible to set this button and saves the icon ref
    public SetCustomButton(iconSprite: Sprite)
    {
        // Saves the icon ref
        this.iconRef.sprite = iconSprite;
    }

    // This method is called on click button, is responsible to change hightlight
    public SelectButton()
    {
        // Set the main color to hightlight color
        this.iconRef.color = this.highlightColor;
    }

    // This method is responsible to reset button color
    public ResetButton()
    {
        // Set the main color to default
        this.iconRef.color = this.defaultColor;
    }

}