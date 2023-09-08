import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class PlayerData extends ZepetoScriptBehaviour 
{
    public wolrdId: string;
    public ownerSessionId: string;
    
    public isReady: boolean;
    public isWinner: boolean; 
    public isCustomized: boolean;

    public headItem: string;
    public chestItem: string;
    public legsItem: string;
    public footItem: string;
}