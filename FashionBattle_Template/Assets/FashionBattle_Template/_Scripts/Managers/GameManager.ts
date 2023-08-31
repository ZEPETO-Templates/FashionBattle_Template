import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject } from 'UnityEngine';
import MultiplayerManager from '../Multiplayer/MultiplayerManager';

export default class GameManager extends ZepetoScriptBehaviour 
{
    public static instance: GameManager;

    public playerCount: number;

    public stageCustomization: GameObject;
    public stageRunway: GameObject;

    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;

        this.SwitchStage(STAGE.CUSTOMIZATION);
    }

    public SwitchStage(stage: STAGE)
    {
        this.stageCustomization.SetActive(false);
        this.stageRunway.SetActive(false);

        switch (stage)
        {
            case STAGE.CUSTOMIZATION:
                this.stageCustomization.SetActive(true);
                break;
            case STAGE.RUNWAY:
                this.stageRunway.SetActive(true);
                break;
        }
    }
}

enum STAGE
{
    CUSTOMIZATION,
    RUNWAY
}