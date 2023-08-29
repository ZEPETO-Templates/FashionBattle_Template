import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ShopService } from 'ZEPETO.Module.Shop';
import { TextureRequest } from 'ZEPETO.Module';
import * as UnityEngine from 'UnityEngine';
import { RawImage } from 'UnityEngine.UI';

export default class DownloadThumbnailSample extends ZepetoScriptBehaviour {

    public image: RawImage;
    public itemCode: string;

    Start() {
        this.StartCoroutine(this.DownloadItemTexture());
    }

    public ClearAndReloadImage(itemName: string)
    {
        this.itemCode = itemName;
        this.StartCoroutine(this.DownloadItemTexture());
    }

    *DownloadItemTexture() {
        // Download thumbnail texture for the specified item code
        var request = ShopService.DownloadItemThumbnail(this.itemCode);

        yield new UnityEngine.WaitUntil(() => request.keepWaiting == false);

        if (request.responseData.isSuccess) {
            this.image.texture = request.responseData.texture;
        }
    }

}