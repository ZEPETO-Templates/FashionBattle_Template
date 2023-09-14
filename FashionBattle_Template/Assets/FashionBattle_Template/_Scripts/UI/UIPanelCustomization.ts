import { Debug, GameObject, Time } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { RoundedRectangleButton } from "ZEPETO.World.Gui";
import UIManager, { UIPanelType } from "../Managers/UIManager";
import CustomizationButton from "./CustomizationButton";
import { Slider } from "UnityEngine.UI";
import GameManager from "../Managers/GameManager";
import { ITEM_TYPE } from "../Multiplayer/MultiplayerManager";
import ClothingManager from "../Managers/ClothingManager";

// This class controls the view of the panel for customization options.
export default class UIPanelCustomization extends ZepetoScriptBehaviour 
{
  @Header("Time")
  public timeSlider: Slider; // The time slider control in the panel.

  @HideInInspector() public isCounterRunning: bool = false; // Indicates whether a counter is currently running 
  @HideInInspector() public timeCounter: number; // The current time counter value reference

  public loadingPanel: GameObject; // The loading panel reference

  public waitingContainer: GameObject; // The waiting container reference

  public doneButton: RoundedRectangleButton; // The done button reference

  public selectionButtons: RoundedRectangleButton[]; // An array of selection buttons 
  public itemButtons: GameObject[]; // An array of items buttons 

  public bodyPartSelected: BODYPART_SELECTION = BODYPART_SELECTION.HEAD;

   // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
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

   // This method resets the UI panel to its initial state for customization.
  public ResetPanel() 
  {
    this.timeCounter = GameManager.instance.customizationTimeLimit; // Set the time counter
    this.timeSlider.maxValue = GameManager.instance.customizationTimeLimit; // Set the time slider's maximum value
    this.isCounterRunning = true; // Start the counter
    this.waitingContainer.SetActive(false); // Hide the waiting container
  }

    // Update is called every frame, if the MonoBehaviour is enabled
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
