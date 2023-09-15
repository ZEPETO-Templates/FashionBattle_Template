import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui'
import GameManager from '../Managers/GameManager';
import DownloadThumbnailSample from './DownloadThumbnailSample';
import { Color, GameObject } from 'UnityEngine';
import { ITEM_TYPE } from '../Multiplayer/MultiplayerManager';
import UIPanelCustomization from './UIPanelCustomization';

export default class CustomizationButton extends ZepetoScriptBehaviour 
{
    public btn: RoundedRectangleButton;
    public thumbnail: GameObject;
    public selectedImage: GameObject;
    
    private _uiPanelCustomization: GameObject;
    private _itemId: string;
    private _itemType: ITEM_TYPE;

    Start() 
    {    
        this.btn.OnClick.AddListener(()=> 
        {
            GameManager.instance.ChangeCostume(this._itemType, this._itemId);
            this.SelectButton();
        });
    }

    public SetItemId(itemType: ITEM_TYPE ,itemId: string)
    {
        this._itemId = itemId;
        this._itemType = itemType;
        this.thumbnail.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(itemId);
    }

    public SelectButton()
    {
        this._uiPanelCustomization.GetComponent<UIPanelCustomization>().OnSelectItemButton();
        this.SetSelected(true);
    }

    public ResetButton()
    {
        this.btn.color = Color.white;
    }

    public SetUiParentPanel(uiPanelCustomization: GameObject)
    {
        this._uiPanelCustomization = uiPanelCustomization;
    }

    public SetSelected(value: boolean)
    {
        this.selectedImage.SetActive(value);
    }
}