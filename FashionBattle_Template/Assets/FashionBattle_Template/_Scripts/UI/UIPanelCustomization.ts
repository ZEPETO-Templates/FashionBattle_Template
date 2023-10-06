import { GameObject, Time } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { RoundedRectangleButton } from "ZEPETO.World.Gui";
import CustomizationButton from "./CustomizationButton";
import { Slider } from "UnityEngine.UI";
import GameManager from "../Managers/GameManager";
import { ITEM_TYPE } from "../Multiplayer/MultiplayerManager";
import ClothingManager from "../Managers/ClothingManager";
import CustomButton from "./CustomButton";

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
    // We obtain and save the Game Manager customization time limit value
    this.timeCounter = GameManager.instance.customizationTimeLimit;
    this.timeSlider.maxValue = GameManager.instance.customizationTimeLimit;
    // We change the value of the counter is running to true
    this.isCounterRunning = true;

    // We hide the waiting screen
    this.waitingContainer.SetActive(false);

    // We obtain and set Customization Button
    this.itemButtons.forEach((element) => 
    {
      // We set the parent
      element.GetComponent<CustomizationButton>().SetUiParentPanel(this.gameObject);
    });

    // First Populate
    this.PopulateButtons(BODYPART_SELECTION.HEAD);
    this.HighlightButtons(0);

    // We add action on click the hats button
    this.selectionButtons[0].OnClick.AddListener(() => 
    {
      // Call the PopulateButtons with HEAD value
      this.PopulateButtons(BODYPART_SELECTION.HEAD);
      // Call the function HighlightButtons with value 0
      this.HighlightButtons(0);
      // Call the function OnSelectItemButton
      this.SwitchOffAllItemButtons();
    });

    // We add action on click the chest button    
    this.selectionButtons[1].OnClick.AddListener(() => 
    {
      // Call the function PopulateButtons with CHEST value
      this.PopulateButtons(BODYPART_SELECTION.CHEST);
      // Call the function HighlightButtons with value 1
      this.HighlightButtons(1);
      // Call the function OnSelectItemButton
      this.SwitchOffAllItemButtons();
    });

    // We add action on click the legs button    
    this.selectionButtons[2].OnClick.AddListener(() => 
    {
      // Call the function PopulateButtons with LEGS value
      this.PopulateButtons(BODYPART_SELECTION.LEGS);
      // Call the function HighlightButtons with value 2
      this.HighlightButtons(2);
      // Call the function OnSelectItemButton
      this.SwitchOffAllItemButtons();
    });

    // We add action on click the shoes button  
    this.selectionButtons[3].OnClick.AddListener(() => 
    {
      // Call the function PopulateButtons with SHOES value
      this.PopulateButtons(BODYPART_SELECTION.SHOES);
      // Call the function HighlightButtons with value 3
      this.HighlightButtons(3);
      // Call the function OnSelectItemButton
      this.SwitchOffAllItemButtons();
    });

    // We add action on click the done button
    this.doneButton.OnClick.AddListener(() => 
    {
      // We change the value of the counter is running to false
      this.isCounterRunning = false;
      // We show the waiting screen
      this.waitingContainer.SetActive(true);
      // We set the value of the time counter to cero
      this.timeCounter = 0;
      // We set the value of the time slider to cero
      this.timeSlider.value = 0;

      // Call the function OnPlayerDoneCustomize with value true
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

    this.PopulateButtons(BODYPART_SELECTION.HEAD);
    this.HighlightButtons(0);
    this.SwitchOffAllItemButtons();
  }

  // Update is called every frame, if the MonoBehaviour is enabled
  Update() 
  {
    // Check if the value of counter is running is true
    if (this.isCounterRunning) 
    {
      // We subtract 1 real second from the counter
      this.timeCounter -= Time.deltaTime;
      // We update value of the slider
      this.timeSlider.value = this.timeCounter;

      // Check if the counter values is minor of cero
      if (this.timeCounter <= 0) 
      {
        // We change the value of the counter is running to false
        this.isCounterRunning = false;
        // Call the function OnPlayerDoneCustomize with value true
        GameManager.instance.OnPlayerDoneCustomize(true);
      }
    }
  }

  // This method is used to populate buttons
  public PopulateButtons(selection: BODYPART_SELECTION) 
  {
    // We Create a variable to store a temporary number
    let i = 0;

    // Check if the case is equal selection value
    switch (selection) 
    {
      // When is "HEAD"
      case BODYPART_SELECTION.HEAD:
        this.itemButtons.forEach((element) => 
        {
          // We obtain and set Customization Button 
          element.GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.HEAD, ClothingManager.instance.headItems[i]);
          i++;
        });
        break;
      // When is "CHEST"
      case BODYPART_SELECTION.CHEST:
        this.itemButtons.forEach((element) => 
        {
          // We obtain and set Customization Button
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.CHEST, ClothingManager.instance.chestItems[i]);
          i++;
        });
        break;
      // When is "LEGS"  
      case BODYPART_SELECTION.LEGS:
        this.itemButtons.forEach((element) => 
        {
          // We obtain and set Customization Button
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.LEGS, ClothingManager.instance.legsItems[i]);
          i++;
        });
        break;
      // When is "SHOES"
      case BODYPART_SELECTION.SHOES:
        this.itemButtons.forEach((element) => 
        {
          // We obtain and set Customization Button
          element
            .GetComponent<CustomizationButton>()
            .SetItemId(ITEM_TYPE.FOOT, ClothingManager.instance.shoesItems[i]);
          i++;
        });
        break;
    }
  }

  // This method is used to highlight buttons
  public HighlightButtons(index: number)
  {
    // We reset all highlight buttons
    for (let i = 0; i < this.selectionButtons.length; i++) {
      this.selectionButtons[i].GetComponent<CustomButton>().ResetButton();
    }

    // We set highlight button
    this.selectionButtons[index].GetComponent<CustomButton>().SelectButton();
  }

  // This method is used to show or hide loading screen
  public SetLoadingPanel(value: bool) 
  {
    this.loadingPanel.SetActive(value);
  }

  // This method is used to switch off the highlight item buttons
  public SwitchOffAllItemButtons()
  {
    this.itemButtons.forEach((element) => 
    {
      element.GetComponent<CustomizationButton>().SetSelected(false);
    });
  }

}

enum BODYPART_SELECTION 
{
  HEAD = "Head",
  CHEST = "Chest",
  LEGS = "Legs",
  SHOES = "Shoes",
}
