import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from '../IModule';

export default class SyncPlayerDataModule extends IModule 
{
    private playersDataCache: PlayerDataModel[] = [];
    private voteDataCache: VoteModel[] = [];
    private isGameStarted = false;

    async OnCreate() 
    {
        this.server.onMessage(MESSAGE.SendPlayerReady, (client, value: boolean) => {
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

        this.server.onMessage<IVote>(MESSAGE.SendVoteData, (client, message: IVote) => 
        {
            let voteDataModel = this.GetVoteDataFromId(message.sessionId);
            voteDataModel.totalVote += message.voteValue;
        });

        this.server.onMessage(MESSAGE.SendResetVoteData,(client, message) => {
            this.voteDataCache.forEach((v) => {
                v.totalVote = 0;
                v.finalVote = 0;
            });
        });
        
        this.server.onMessage(MESSAGE.RequestVoteDataCache, (client, message: string) => {
            this.server.broadcast(MESSAGE.OnResetVoteCache, "True");

            this.voteDataCache.forEach((vd) => {
                this.server.broadcast(MESSAGE.OnVoteCacheArrive, vd);
            });
        });

    }

    async OnJoin(client: SandboxPlayer) {

        // Player Model Creation
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

        
        // Vote Model Creation
        const newVoteData: VoteModel = {
            sessionId: client.sessionId,
            totalVote: 0,
            finalVote: 0,
        }

        this.voteDataCache.push(newVoteData);
        
        this.server.broadcast(MESSAGE.OnResetVoteCache, "True");
        this.voteDataCache.forEach((vd) => {
            this.server.broadcast(MESSAGE.OnVoteCacheArrive, vd);
        });
    }

    async OnLeave(client: SandboxPlayer) 
    {
        this.RemovePlayerData(client.sessionId);
        this.RemoveVoteData(client.sessionId);
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
        
        playerDataModel.wolrdId = playerData.wolrdId;
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

    private RemoveVoteData(sessionId: string)
    {
        let playerVoteData = this.GetVoteDataFromId(sessionId);

        let index = this.voteDataCache.findIndex(d => d.sessionId === playerVoteData.sessionId);
        if (index > -1) {
            this.voteDataCache.splice(index, 1);
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

    private GetVoteDataFromId(sessionId: string): VoteModel
    {
        let result = this.voteDataCache[0];
        this.voteDataCache.forEach((vd) => {
            if (vd.sessionId == sessionId) {
                result = vd;
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
    OnAllPlayersCustomized = "OnAllPlayersCustomized",

    SendVoteData = "SendVoteData",
    SendResetVoteData = "SendResetVoteData",
    OnResetVoteCache = "OnResetVoteCache",
    OnVoteCacheArrive = "OnVoteCacheArrive",
    RequestVoteDataCache = "RequestVoteDataCache"
}

interface PlayerDataModel {
    wolrdId?: string;
    ownerSessionId?: string;
    isReady?: boolean;
    isWinner?: boolean;
    isCustomized?: boolean;

    headItem?: string;
    chestItem?: string;
    legsItem?: string;
    footItem?: string;
}

interface IVote {
    sessionId: string;
    voteValue: number;
}

interface VoteModel
{
    sessionId?: string;
    totalVote: number;
    finalVote?: number;
}