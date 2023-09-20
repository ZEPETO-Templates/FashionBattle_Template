import { Animator, GameObject, WaitUntil } from 'UnityEngine';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ContentItem, ItemKeyword, ShopService } from 'ZEPETO.Module.Shop';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WorldService } from 'ZEPETO.World';
import { ZepetoContext } from 'Zepeto';

export default class ClothReset extends ZepetoScriptBehaviour {

    private wearingList: ContentItem[];
    private nonWearingList: ContentItem[];

    // Get the palyer's current inventory. 
    *GrabPlayerData()
    {
        var requestItemList = ShopService.GetMyItemListAsync(ItemKeyword.all, null);

        yield new WaitUntil(() => requestItemList.keepWaiting == false);

        if (requestItemList.responseData.isSuccess) {
            let contentItems: ContentItem[] = requestItemList.responseData.contentItems;
            this.FilterWearing(WorldService.userId, contentItems);
        }
    }

    //Filter by wearing and not wearing. 
    FilterWearing(userId: string, items: ContentItem[])
    {
        let player : ZepetoPlayer = ZepetoPlayers.instance.GetPlayer(userId);
        let context : ZepetoContext = player.character.Context;
        let anim : Animator = player.character.ZepetoAnimator;
        
        this.wearingList = new Array<ContentItem>();
        this.nonWearingList = new Array<ContentItem>();
        
        // //Get Wearing Items First
        // for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
        // {
        //     let item = items[itemIndex];
        //     let meshObject: GameObject = this.FindMesh(userId, item);
            
        //     if (meshObject != undefined)
        //     {
        //         this.CopyMesh(meshObject, item);
        //         this.wearingList.push(item);
        //     }
        //     else
        //     {
        //         this.nonWearingList.push(item);
        //     }
        // }

        this.nonWearingList.forEach((item) => {
            console.log(`NonWearing ${item.id}`);
        })
    }

}