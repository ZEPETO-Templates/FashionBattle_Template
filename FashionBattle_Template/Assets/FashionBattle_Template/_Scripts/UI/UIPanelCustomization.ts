import { Debug, GameObject, Time } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { RoundedRectangleButton } from "ZEPETO.World.Gui";
import UIManager, { UIPanelType } from "../Managers/UIManager";
import CustomizationButton from "./CustomizationButton";
import { Slider } from "UnityEngine.UI";
import GameManager from "../Managers/GameManager";
import { ITEM_TYPE } from "../Multiplayer/MultiplayerManager";
import ClothingManager from "../Managers/ClothingManager";

export default class UIPanelCustomization extends ZepetoScriptBehaviour 
{
  public timeSlider: Slider;

  @HideInInspector() public isCounterRunning: bool = false;
  @HideInInspector() public timeCounter: number;

  public loadingPanel: GameObject;

  public waitingContainer: GameObject;

  public doneButton: RoundedRectangleButton;

  public selectionButtons: RoundedRectangleButton[];
  public itemButtons: GameObject[];

  public bodyPartSelected: BODYPART_SELECTION = BODYPART_SELECTION.HEAD;


  Start() 
  {
    this.timeCounter = GameManager.instance.customizationTimeLimit;
    this.timeSlider.maxValue = GameManager.instance.customizationTimeLimit;
    this.isCounterRunning = true;

    this.waitingContainer.SetActive(false);

    // Fist Populate
    this.PopulateButtons(BODYPART_SELECTION.HEAD);

    this.selectionButtons[0].OnClick.AddListener(() => 
    {
      this.PopulateButtons(BODYPART_SELECTION.HEAD);
    });

    this.selectionButtons[1].OnClick.AddListener(() => 
    {
      this.PopulateButtons(BODYPART_SELECTION.CHEST);
    });

    this.selectionButtons[2].OnClick.AddListener(() => 
    {
      this.PopulateButtons(BODYPART_SELECTION.LEGS);
    });

    this.selectionButtons[3].OnClick.AddListener(() => 
    {
      this.PopulateButtons(BODYPART_SELECTION.SHOES);
    });

    this.doneButton.OnClick.AddListener(() => 
    {
      this.isCounterRunning = false;
      this.waitingContainer.SetActive(true);
      this.timeCounter = 0;
      this.timeSlider.value = 0;

      GameManager.instance.OnPlayerDoneCustomize(true);
    });
  }

  public ResetPanel() 
  {
    this.timeCounter = GameManager.instance.customizationTimeLimit;
    this.timeSlider.maxValue = GameManager.instance.customizationTimeLimit;
    this.isCounterRunning = true;
    this.waitingContainer.SetActive(false);
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
        GameManager.instance.OnPlayerDoneCustomize(true);
      }
    }
  }

  public PopulateButtons(selection: BODYPART_SELECTION) 
  {
    let i = 0;
    switch (selection) 
    {
      case BODYPART_SELECTION.HEAD:
        this.itemButtons.forEach((element) => 
        {
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.HEAD, ClothingManager.instance.headItems[i]);
          i++;
        });
        break;
      case BODYPART_SELECTION.CHEST:
        this.itemButtons.forEach((element) => 
        {
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.CHEST, ClothingManager.instance.chestItems[i]);
          i++;
        });
        break;
      case BODYPART_SELECTION.LEGS:
        this.itemButtons.forEach((element) => 
        {
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.LEGS, ClothingManager.instance.legsItems[i]);
          i++;
        });
        break;
      case BODYPART_SELECTION.SHOES:
        this.itemButtons.forEach((element) => 
        {
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.FOOT, ClothingManager.instance.shoesItems[i]);
          i++;
        });
        break;
    }
  }

  public SetLoadingPanel(value: bool) 
  {
    this.loadingPanel.SetActive(value);
  }
}

enum BODYPART_SELECTION 
{
  HEAD = "Head",
  CHEST = "Chest",
  LEGS = "Legs",
  SHOES = "Shoes",
}
