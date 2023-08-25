import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

export default class MultiplayerManager extends ZepetoScriptBehaviour {

    public multiplay: ZepetoWorldMultiplay;
    public room: Room;

    Start() {    
        if (!this.multiplay)
            this.multiplay = this.GetComponent<ZepetoWorldMultiplay>();
        if (!this.multiplay) console.warn("Add ZepetoWorldMultiplay First");
        this.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
        }
    }

}