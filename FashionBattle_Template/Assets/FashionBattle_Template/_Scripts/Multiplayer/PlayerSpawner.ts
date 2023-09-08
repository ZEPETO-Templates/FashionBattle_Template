import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { LocalPlayer, SpawnInfo, ZepetoCharacter, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {State, Player} from "ZEPETO.Multiplay.Schema";
import { Debug, GameObject, Input, KeyCode, Transform, WaitForSeconds } from 'UnityEngine';
import MultiplayerManager, { PlayerDataModel } from './MultiplayerManager';
import { ItemContent, MannequinPreviewer } from 'ZEPETO.Mannequin';
import { ZepetoContext, ZepetoPropertyFlag } from 'Zepeto';
import UIManager from '../Managers/UIManager';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour
{
    public spawnPosition: Transform;
    private _currentPlayers: Map<string, Player> = new Map<string, Player>();
    
    // ClothingPickup
    public _previewer: MannequinPreviewer;
    public itemsContent: ItemContent[];
    
    private itemContentHead: ItemContent;
    private itemContentChest: ItemContent;
    private itemContentLegs: ItemContent;
    private itemContentShoes: ItemContent;

    private _currentZepetoChatacterDisplayerd : ZepetoPlayer;
    
    /* Singleton */
    private static m_instance: PlayerSpawner = null;
    public static get instance(): PlayerSpawner {
        if (this.m_instance === null) {
            this.m_instance = GameObject.FindObjectOfType<PlayerSpawner>();
            if (this.m_instance === null) {
                this.m_instance = new GameObject(PlayerSpawner.name).AddComponent<PlayerSpawner>();
            }
        }
        return this.m_instance;
    }
    
    private Awake() {
        if (PlayerSpawner.m_instance !== null && PlayerSpawner.m_instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            PlayerSpawner.m_instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }
    
    private Start()
    {
        ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
            ZepetoPlayers.instance.ZepetoCamera.gameObject.SetActive(false);
            
            
            UIManager.instance.SetRadyButtonInteractable();
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);

            this._currentZepetoChatacterDisplayerd = zepetoPlayer;
            this.HideCurrentZepetoPlayer();
        });
    }
    
    private Update()
    {
        if(Input.GetKeyDown(KeyCode.T))
        {
            this.UpdateCharacterCloth(MultiplayerManager.instance.playersData[0].ownerSessionId)
        }
    }

    /** multiplayer Spawn **/
    public OnStateChange(state: State, isFirst: boolean) 
    {
        const join = new Map<string, Player>();
        const leave = new Map<string, Player>(this._currentPlayers);

        state.players.ForEach((sessionId: string, player: Player) => {
            if (!this._currentPlayers.has(sessionId)) {
                join.set(sessionId, player);
            }
            leave.delete(sessionId);
        });

        // [RoomState] Create a player instance for players that enter the Room
        join.forEach((player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player));

        // [RoomState] Remove the player instance for players that exit the room
        leave.forEach((player: Player, sessionId: string) => this.OnLeavePlayer(sessionId, player));
    }

    private OnJoinPlayer(sessionId: string, player: Player) 
    {
        console.log(`[OnJoinPlayer] players - sessionId : ${sessionId}`);
        this._currentPlayers.set(sessionId, player);

        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.spawnPosition.transform.position;
        spawnInfo.rotation = this.spawnPosition.transform.rotation;

        const isLocal = MultiplayerManager.instance.GetRoom().SessionId === player.sessionId;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal);

    }
    
    private OnLeavePlayer(sessionId: string, player: Player) 
    {
        console.log(`[OnLeavePlayer] players - sessionId : ${sessionId}`);
        this._currentPlayers.delete(sessionId);
        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }
    
    public UpdateCharacterCloth(sessionId: string)
    {
        let playerData : PlayerDataModel = MultiplayerManager.instance.GetPlayerData(sessionId);

        this.itemsContent = [];
        
        if (playerData.headItem != "none" && playerData.headItem != "")
        {
            this.itemContentHead = new ItemContent();
            this.itemContentHead.id = playerData.headItem;
            this.itemContentHead.property = ZepetoPropertyFlag.AccessoryHeadwear;
            this.itemsContent.push(this.itemContentHead);
        }

        if (playerData.chestItem != "none" && playerData.chestItem != "")
        {
            this.itemContentChest = new ItemContent();
            this.itemContentChest.id = playerData.chestItem;
            this.itemContentChest.property = ZepetoPropertyFlag.ClothesTop;
            this.itemsContent.push(this.itemContentChest);
        }

        if (playerData.legsItem != "none" && playerData.legsItem != "")
        {
            this.itemContentLegs = new ItemContent();
            this.itemContentLegs.id = playerData.legsItem;
            this.itemContentLegs.property = ZepetoPropertyFlag.ClothesBottom;
            this.itemsContent.push(this.itemContentLegs);
        }

        if (playerData.footItem != "none" && playerData.footItem != "")
        {
            this.itemContentShoes = new ItemContent();
            this.itemContentShoes.id = playerData.footItem;
            this.itemContentShoes.property = ZepetoPropertyFlag.ClothesShoes;
            this.itemsContent.push(this.itemContentShoes);
        }

        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        let context: ZepetoContext = zepetoPlayer.character.Context;
        this._previewer = new MannequinPreviewer(context, this.itemsContent);
        this._previewer.PreviewContents();
    }

    public ShowCharacterOriginal(sessionId: string)
    {
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        zepetoPlayer.character.characterController.enabled = false;
        zepetoPlayer.character.gameObject.transform.position = this.spawnPosition.position;
        zepetoPlayer.character.gameObject.transform.rotation = this.spawnPosition.rotation;
        Debug.LogError("SHOW CHARACTER ORIGINAL");
        zepetoPlayer.character.gameObject.SetActive(true);
        zepetoPlayer.character.characterController.enabled = true;

        this._currentZepetoChatacterDisplayerd = zepetoPlayer;
    }

    public ShowCharacterWithCloth(sessionId: string)
    {
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        zepetoPlayer.character.characterController.enabled = false;
        zepetoPlayer.character.gameObject.transform.position = this.spawnPosition.position;
        zepetoPlayer.character.gameObject.transform.rotation = this.spawnPosition.rotation;
        Debug.LogError("SHOW CHARACTER BY ID");
        zepetoPlayer.character.gameObject.SetActive(true);
        zepetoPlayer.character.characterController.enabled = true;

        this._currentZepetoChatacterDisplayerd = zepetoPlayer;

        this.StartCoroutine(this.WaitAndUpdateClothes(sessionId));
    }

    public HideCurrentZepetoPlayer()
    {
        this._currentZepetoChatacterDisplayerd.character.gameObject.transform.position = this.spawnPosition.position;
        this._currentZepetoChatacterDisplayerd.character.gameObject.transform.rotation = this.spawnPosition.rotation;
        this._currentZepetoChatacterDisplayerd.character.gameObject.SetActive(false);
    }

    *WaitAndUpdateClothes(sessionId: string)
    {
        yield new WaitForSeconds(1);
        this.UpdateCharacterCloth(sessionId);
    }
}