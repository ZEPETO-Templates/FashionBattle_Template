import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import { GameObject, Time } from "UnityEngine";
import { Slider } from "UnityEngine.UI";
import GameManager from "../Managers/GameManager";
import MultiplayerManager from '../Multiplayer/MultiplayerManager';

// This class controls the theme panel
export default class UIPanelTheme extends ZepetoScriptBehaviour {

  public static instance: UIPanelTheme; // Singleton instance variable

  @Header("Time")
    public timeSlider: Slider; // The time slider control in the panel.
    @HideInInspector() public isCounterRunning: bool = false;  // Flag indicating whether the counter is running
    @HideInInspector() public timeCounter: number; // Time counter variable
    public selectThemeText: ZepetoText; // Reference to the selected theme

    @HideInInspector() public theme: bool = false;  // Flag to know if there are themes

    // Awake is called when an enabled script instance is being loaded.
    Awake() 
    {
      // Singleton pattern
      if (UIPanelTheme.instance != null) GameObject.Destroy(this.gameObject);
      else UIPanelTheme.instance = this;
    }
  
// Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start() {    
  
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
         GameManager.instance.theme = true;
         GameManager.instance.StartCustomization();
       }
     }
   }

    // This method is responsible to reset panel
    public ResetThemePanel()
    {
         this.timeCounter = 5;
        GameManager.instance.theme = false;
        this.isCounterRunning = false; // Start the counter
    }

    public StartTheme() 
   { this.timeCounter = 5;
    this.timeSlider.maxValue = GameManager.instance.customizationTimeTheme;   // Set the maximum value of the time slider from GameManager
    this.isCounterRunning = true; // Start the counter
    const selectTheme = MultiplayerManager.instance.GetThemeName(); // Get the current theme in MultiplayerManager
    this.selectThemeText.text = selectTheme; //    // Set text to the selectThemeText
   }
}