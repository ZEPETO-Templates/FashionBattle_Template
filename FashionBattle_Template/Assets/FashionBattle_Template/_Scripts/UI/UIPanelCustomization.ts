import { Debug, GameObject, Time } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIManager, { UIPanelType } from '../Managers/UIManager';
import CustomizationButton from './CustomizationButton';
import { Slider } from 'UnityEngine.UI';
import GameManager from '../Managers/GameManager';
import { ITEM_TYPE } from '../Multiplayer/MultiplayerManager';

export default class UIPanelCustomization extends ZepetoScriptBehaviour {

    public timeSlider: Slider;
    public isCounterRunning: bool = false;
    public timeLimit: number = 20;
    public timeCounter: number;

    public waitinContainer: GameObject;

    public headItems: string[];
    public chestItems: string[];
    public legsItems: string[];
    public shoesItems: string[];

    public selectionButtons: RoundedRectangleButton[]
    public itemButtons: GameObject[]

    public doneButton: RoundedRectangleButton;

    public bodyPartSelected: BODYPART_SELECTION = BODYPART_SELECTION.HEAD;


    Start()
    {
        this.timeCounter = this.timeLimit;
        this.timeSlider.maxValue = this.timeLimit;
        this.isCounterRunning = true;

        this.waitinContainer.SetActive(false);

        this.PopulateButtons(BODYPART_SELECTION.HEAD);

        this.selectionButtons[0].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.HEAD);
        });

        this.selectionButtons[1].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.CHEST);
        });

        this.selectionButtons[2].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.LEGS);
        });

        this.selectionButtons[3].OnClick.AddListener(() => {
            this.PopulateButtons(BODYPART_SELECTION.SHOES);
        });

        this.doneButton.OnClick.AddListener(() => {
            this.isCounterRunning = false;
            this.waitinContainer.SetActive(true);
            this.timeCounter = 0;
            this.timeSlider.value = 0;

            GameManager.instance.OnPlayerDoneCustomize();
        });

    }
    
    Update()
    {
        if (this.isCounterRunning)
        {
            this.timeCounter -= Time.deltaTime;
            this.timeSlider.value = this.timeCounter;

            if (this.timeCounter <= 0)
            {
                this.isCounterRunning = false;
                GameManager.instance.OnPlayerDoneCustomize();
            }
        }
    }

    public PopulateButtons(selection :BODYPART_SELECTION)
    {
        let i = 0;
        switch(selection)
        {
            case BODYPART_SELECTION.HEAD:
                this.itemButtons.forEach(element => {
                    element.GetComponent<CustomizationButton>().SetItemId(ITEM_TYPE.HEAD, this.headItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.CHEST:
                this.itemButtons.forEach(element => {
                    element.GetComponent<CustomizationButton>().SetItemId(ITEM_TYPE.CHEST, this.chestItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.LEGS:
                this.itemButtons.forEach(element => {
                    element.GetComponent<CustomizationButton>().SetItemId(ITEM_TYPE.LEGS, this.legsItems[i]);
                    i++;
                });
                break;
            case BODYPART_SELECTION.SHOES:
                this.itemButtons.forEach(element => {
                    element.GetComponent<CustomizationButton>().SetItemId(ITEM_TYPE.FOOT, this.shoesItems[i]);
                    i++;
                });
                break;
        }
    }

}

enum BODYPART_SELECTION {
    HEAD = "Head",
    CHEST = "Chest",
    LEGS = "Legs",
    SHOES = "Shoes"
}