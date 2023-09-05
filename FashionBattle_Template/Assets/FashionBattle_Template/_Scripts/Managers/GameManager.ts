import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Debug, GameObject, Time, Transform } from 'UnityEngine';
import MultiplayerManager, { ITEM_TYPE } from '../Multiplayer/MultiplayerManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import UIManager, { UIPanelType } from './UIManager';
import PlayerSpawner from '../Multiplayer/PlayerSpawner';

export enum STAGE {
    START,
    CUSTOMIZATION,
    RUNWAY
}

export default class GameManager extends ZepetoScriptBehaviour 
{
    public static instance: GameManager;

    public isPlayerReady: bool = false;

    public playerCount: number;

    public stageCustomization: GameObject;
    public stageRunway: GameObject;

    public isGameStarted: bool = false;
    public playersReady: bool = false;
    public timeToStart: number;
    public counterToStart: number = 10;

    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;

        this.SwitchStage(STAGE.START);

        this.isPlayerReady = false;
        this.counterToStart = this.timeToStart;
    }

    Update()
    {
        if (this.playersReady && !this.isGameStarted)
        {
            this.counterToStart -= Time.deltaTime;
            if(this.counterToStart < 0)
            {
                this.isGameStarted = true;
                UIManager.instance.SwitchUIPanel(UIPanelType.CUSTOMIZATION);
                this.SwitchStage(STAGE.CUSTOMIZATION);
            }
        }
    }

    public SwitchStage(stage: STAGE)
    {
        this.stageCustomization.SetActive(false);
        this.stageRunway.SetActive(false);

        switch (stage)
        {
            case STAGE.START:
                break;
            case STAGE.CUSTOMIZATION:
                this.stageCustomization.SetActive(true);
                PlayerSpawner.instance.ShowCharacter(MultiplayerManager.instance.localPlayerData.ownerSessionId);
                break;
            case STAGE.RUNWAY:
                this.stageRunway.SetActive(true);
                break;
        }
    }

    public SetGameReadyToStart(value: bool)
    {
        this.playersReady = value;
        UIManager.instance.SetCounterToStart(value);
        if(!value)
        {
            this.counterToStart = this.timeToStart;
        }
    }

    public OnPlayerReady()
    {
        this.isPlayerReady = !this.isPlayerReady;
        MultiplayerManager.instance.SetPlayerReady(this.isPlayerReady);
    }

    public OnPlayerDoneCustomize()
    {
        MultiplayerManager.instance.SetPlayerIsCustomize(true);
    }

    // Method to change the costume of the local player using the provided item code.
    public ChangeCostume(itemType: ITEM_TYPE ,itemCode: string) {
        // Use the LocalPlayer property to access the local player instance and set their costume using the provided item code.
        ZepetoPlayers.instance.LocalPlayer.SetCostume(itemCode, () => {
            // Once the costume change is complete, log a message indicating the successful change.
            console.log(`Set Costume Complete : ${itemCode}`);
        });

        MultiplayerManager.instance.SetItemInPlayerData(itemType, itemCode);
    }
}