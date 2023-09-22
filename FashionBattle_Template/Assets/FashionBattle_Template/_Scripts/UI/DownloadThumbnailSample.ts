import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ShopService } from 'ZEPETO.Module.Shop';
import { TextureRequest } from 'ZEPETO.Module';
import * as UnityEngine from 'UnityEngine';
import { RawImage } from 'UnityEngine.UI';

export default class DownloadThumbnailSample extends ZepetoScriptBehaviour 
{
    public image: RawImage; // Reference to save icon
    public itemCode: string; // Reference to save item code

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start() 
    {
        this.StartCoroutine(this.DownloadItemTexture());
    }

    // This method is used to clear and reload the icon and item code
    public ClearAndReloadImage(itemName: string)
    {
        // We set the new item code value
        this.itemCode = itemName;

        // Call to start the coroutine DownloadItemTexture
        this.StartCoroutine(this.DownloadItemTexture());
    }

    // This coroutine is used to download the icons
    *DownloadItemTexture() 
    {
        // Download thumbnail texture for the specified item code
        var request = ShopService.DownloadItemThumbnail(this.itemCode);

        yield new UnityEngine.WaitUntil(() => request.keepWaiting == false);

        // Check if the response data is success
        if (request.responseData.isSuccess) 
        {
            // We set the icon with the response data value
            this.image.texture = request.responseData.texture;
        }
    }

}