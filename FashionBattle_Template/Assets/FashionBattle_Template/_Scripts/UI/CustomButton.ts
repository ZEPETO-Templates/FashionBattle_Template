import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CustomButton extends ZepetoScriptBehaviour {

    @SerializeField() private iconRef: GameObject; // Reference to the icon
    public selectedImage: GameObject; // Reference to the selected image
   

    // This method is called on click button, is responsible to change image
    public SelectButton()
    {
        this.selectedImage.SetActive(true);
    }

    // This method is responsible to reset button color
    public ResetButton()
    {
        this.iconRef.SetActive(true);
        this.selectedImage.SetActive(false);
    }

}