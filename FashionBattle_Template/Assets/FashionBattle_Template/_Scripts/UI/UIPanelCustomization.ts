import { Debug, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import DownloadThumbnailSample from './DownloadThumbnailSample';

export default class UIPanelCustomization extends ZepetoScriptBehaviour {

    public headItems: string[];
    public chestItems: string[];
    public legsItems: string[];
    public shoesItems: string[];

    public buttons: RoundedRectangleButton[]
    public thumbnails: GameObject[]

    public bodyPartSelected: BODYPART_SELECTION = BODYPART_SELECTION.HEAD;

    Start()
    {
        this.PopulateButtons(BODYPART_SELECTION.HEAD);

        this.buttons[0].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.HEAD);
        });

        this.buttons[1].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.CHEST);
        });

        this.buttons[2].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.LEGS);
        });

        this.buttons[3].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.SHOES);
        });
    }
    
    public PopulateButtons(selection :BODYPART_SELECTION)
    {
        let i = 0;
        switch(selection)
        {
            case BODYPART_SELECTION.HEAD:
                this.thumbnails.forEach(element => {
                    element.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(this.headItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.CHEST:
                this.thumbnails.forEach(element => {
                    element.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(this.chestItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.LEGS:
                this.thumbnails.forEach(element => {
                    element.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(this.legsItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.SHOES:
                this.thumbnails.forEach(element => {
                    element.GetComponent<DownloadThumbnailSample>().ClearAndReloadImage(this.shoesItems[i]);
                    i++;
                });
                break;
        }
    }

}

enum BODYPART_SELECTION {
    HEAD = "Head",
    CHEST = "Chest",
    LEGS = "Legs",
    SHOES = "Shoes"
}