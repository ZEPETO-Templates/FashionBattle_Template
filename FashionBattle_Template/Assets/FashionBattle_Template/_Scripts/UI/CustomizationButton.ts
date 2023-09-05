import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui'
import GameManager from '../Managers/GameManager';
import DownloadThumbnailSample from './DownloadThumbnailSample';
import { GameObject } from 'UnityEngine';
import { ITEM_TYPE } from '../Multiplayer/MultiplayerManager';

export default class CustomizationButton extends ZepetoScriptBehaviour 
{
    public itemId: string;
    public itemType: ITEM_TYPE;

    public btn: RoundedRectangleButton;
    public thumbnail: GameObject;

    Start() 
    {    
        this.btn.OnClick.AddListener(()=> {
            GameManager.instance.ChangeCostume(this.itemType, this.itemId);
        });
    }

    public SetItemId(itemType: ITEM_TYPE ,itemId: string)
    {
        this.itemId = itemId;
        this.itemType = itemType;
        this.thumbnail.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(itemId);
    }

}