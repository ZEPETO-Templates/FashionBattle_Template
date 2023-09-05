import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from '../IModule';

export default class SyncPlayerDataModule extends IModule 
{
    private playersDataCache: PlayerDataModel[] = [];
    private isGameStarted = false;

    async OnCreate() 
    {
        this.server.onMessage(MESSAGE.SendPlayerReady, (client, value: boolean) => {
            console.log("USER: " + client.sessionId +  " READY :: " + value);
            let playerDataModel = this.GetPlayerDataFromId(client.sessionId);
            playerDataModel.isReady = value;
            this.CheckIfPlayersReady();
        });

        this.server.onMessage(MESSAGE.SendGameStarted, (client, value: boolean) => 
        {
            this.isGameStarted = value;
        });

        this.server.onMessage<PlayerDataModel>(MESSAGE.SendPlayerData, (client, message: PlayerDataModel) => 
        {
            console.log("MESSAGE:: SEND PLAYER DATA :: SESSION ID: " + message.ownerSessionId);

            if (this.CheckIfPlayerExist(message)) 
            {
                console.log("MESSAGE:: UPDATE PLAYER DATA :: SESSION ID: " + message.ownerSessionId);
                this.UpdatePlayerData(client, message);
            }
            else 
            {
                // console.log("MESSAGE:: CREATE NEW PLAYER DATA :: SESSION ID: " + message.ownerSessionId);
                // const newPlayerData: PlayerDataModel = {
                //     ownerSessionId: message.ownerSessionId,
                //     isReady: message.isReady,
                //     isWinner: message.isWinner,
    
                //     headItem: message.headItem,
                //     chestItem: message.chestItem,
                //     legsItem: message.legsItem,
                //     footItem: message.footItem,
                // };
                // this.playersDataCache.push(newPlayerData);
            };
        });

        this.server.onMessage(MESSAGE.RequestPlayersDataCache, (client, message: string) =>
        {
            this.server.broadcast(MESSAGE.OnResetPlayerDataCache, "True");

            this.playersDataCache.forEach((pd) => {
                this.server.broadcast(MESSAGE.OnPlayersDataCacheArrive, pd );
            });
        });
    }

    async OnJoin(client: SandboxPlayer) {
        const newPlayerData: PlayerDataModel = {
            ownerSessionId: client.sessionId,
            isReady: false,
            isWinner: false,
            isCustomized: false,

            headItem: "none",
            chestItem: "none",
            legsItem: "none",
            footItem: "none",
        };
        this.playersDataCache.push(newPlayerData);

        this.server.broadcast(MESSAGE.OnResetPlayerDataCache, "True");

        this.playersDataCache.forEach((pd) => {
            this.server.broadcast(MESSAGE.OnPlayersDataCacheArrive, pd);
        });
    }

    async OnLeave(client: SandboxPlayer) 
    {
        this.RemovePlayerData(client.sessionId);
    }

    OnTick(deltaTime: number) {}

    private CheckIfPlayerExist(playerData: PlayerDataModel): boolean 
    {
        let result = false;

        if (this.playersDataCache != null && this.playersDataCache.length > 0) 
        {
            this.playersDataCache.forEach((pd) => {
                if (pd.ownerSessionId == playerData.ownerSessionId) {
                    result = true;
                }
            });
        }

        return result;
    }

    private UpdatePlayerData(client: SandboxPlayer, playerData: PlayerDataModel) 
    {
        let playerDataModel = this.GetPlayerDataFromId(client.sessionId);
        
        playerDataModel.ownerSessionId = playerData.ownerSessionId;
        playerDataModel.isReady = playerData.isReady;
        playerDataModel.isWinner = playerData.isWinner;
        playerDataModel.isCustomized = playerData.isCustomized;

        playerDataModel.headItem = playerData.headItem;
        playerDataModel.chestItem = playerData.chestItem;
        playerDataModel.legsItem = playerData.legsItem;
        playerDataModel.footItem = playerData.footItem;

        this.CheckIfAllPlayersAreCustomized();

        if(!this.isGameStarted)
        {
            this.CheckIfPlayersReady();
        }
        
        this.server.broadcast(MESSAGE.OnResetPlayerDataCache, "True");
        
        this.playersDataCache.forEach((pd) => {
            this.server.broadcast(MESSAGE.OnPlayersDataCacheArrive, pd);
        });
        
    }

    private RemovePlayerData(sessionId: string)
    {
        let playerDataModel = this.GetPlayerDataFromId(sessionId);

        let index = this.playersDataCache.findIndex(d => d.ownerSessionId === playerDataModel.ownerSessionId);
        if (index > -1) {
            this.playersDataCache.splice(index, 1);
        }
    }

    private GetPlayerDataFromId(sessionId: string) : PlayerDataModel
    {
        let result = this.playersDataCache[0];
        this.playersDataCache.forEach((pd) => {
            if (pd.ownerSessionId == sessionId) {
                result = pd;
            }
        });

        return result;
    }

    private CheckIfPlayersReady()
    {
        let result = true;
        this.playersDataCache.forEach((pd) => {
            if (pd.isReady == false) {
                result = false;
            }
        });

        this.isGameStarted = result;

        console.log("ALL PLAYERS READY :: " + result);

        this.server.broadcast(MESSAGE.OnPlayersReady, result);
    }

    public CheckIfAllPlayersAreCustomized()
    {
        let result = true;
        this.playersDataCache.forEach((pd) => {
            console.log("C: " + pd.isCustomized);
            if (pd.isCustomized == false) {
                result = false;
            }
        });

        console.log("ON ALL CUSTOMIZE: " + result);

        if(result)
        {
            this.server.broadcast(MESSAGE.OnAllPlayersCustomized, result);
        }
    }
}

enum MESSAGE {
    SendPlayerData = "SendPlayerData",
    SendPlayerReady = "SendPlayerReady",
    SendGameStarted = "SendGameStarted",
    RemovePlayerData = "RemovePlayerData",
    RequestPlayersDataCache = "RequestPlayersDataCache",
    OnResetPlayerDataCache = "OnResetPlayerDataCache",
    OnPlayersDataCacheArrive = "OnPlayersDataCacheArrive",
    OnPlayersReady = "OnPlayersReady",
    OnAllPlayersCustomized = "OnAllPlayersCustomized"
}

interface PlayerDataModel {
    ownerSessionId?: string;
    isReady?: boolean;
    isWinner?: boolean;
    isCustomized?: boolean;

    headItem?: string;
    chestItem?: string;
    legsItem?: string;
    footItem?: string;
}