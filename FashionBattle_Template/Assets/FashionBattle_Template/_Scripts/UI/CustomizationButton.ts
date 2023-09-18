import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui'
import GameManager from '../Managers/GameManager';
import DownloadThumbnailSample from './DownloadThumbnailSample';
import { Color, GameObject } from 'UnityEngine';
import { ITEM_TYPE } from '../Multiplayer/MultiplayerManager';
import UIPanelCustomization from './UIPanelCustomization';

export default class CustomizationButton extends ZepetoScriptBehaviour 
{
    public btn: RoundedRectangleButton; // Reference to the select button
    public thumbnail: GameObject; // Reference to the icon image
    public selectedImage: GameObject; // Reference to the selected image
    
    private _uiPanelCustomization: GameObject; // Reference to save UIPanel script
    private _itemId: string; // This variable saves the item id
    private _itemType: ITEM_TYPE; // This variable saves the item type

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start() 
    {    
        // First add action on click the main button
        this.btn.OnClick.AddListener(()=> 
        {
            // Call to the function ChangeCostume
            GameManager.instance.ChangeCostume(this._itemType, this._itemId);

            // Call to the function to hightlight button
            this.SelectButton();
        });
    }

    // This method is used to set item and download the icon
    public SetItemId(itemType: ITEM_TYPE ,itemId: string)
    {
        // Saves the item id
        this._itemId = itemId;

        //Saves the item type
        this._itemType = itemType;

        // Call to the function to download and save icon
        this.thumbnail.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(itemId);
    }

    // This method is responsible to select button
    public SelectButton()
    {
        // Call to the function OnSelectItemButton
        this._uiPanelCustomization.GetComponent<UIPanelCustomization>().OnSelectItemButton();

        // Call to the function SetSelected with value true
        this.SetSelected(true);
    }

    // This methos is responsible to reset button color and reset hightlight
    public ResetButton()
    {
        // Set the button color to white (Default color)
        this.btn.color = Color.white;
    }

    // This method is responsible to set the UIPanel script
    public SetUiParentPanel(uiPanelCustomization: GameObject)
    {
        this._uiPanelCustomization = uiPanelCustomization;
    }

    // This method is responsible to set hightlight
    public SetSelected(value: boolean)
    {
        // Set active selected image by new value
        this.selectedImage.SetActive(value);
    }
}