import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import { GameObject, Time } from "UnityEngine";
import { Slider } from "UnityEngine.UI";
import GameManager from "../Managers/GameManager";

// This class controls the theme panel
export default class UIPanelTheme extends ZepetoScriptBehaviour {

  public static instance: UIPanelTheme; // Singleton instance variable

  @Header("Time")
    public timeSlider: Slider; // The time slider control in the panel.
    @HideInInspector() public isCounterRunning: bool = false;  // Flag indicating whether the counter is running
    @HideInInspector() public timeCounter: number; // Time counter variable
    public selectThemeText: ZepetoText; // Reference to the selected theme

    @Header("Themes")
    public themeText: string[]; // This variable saves all themes
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

// This method get a random theme 
   public GetTextThemeRandom(): string {
     // Check if themeText is null or empty
    if (this.themeText == null || this.themeText.length === 0) {
        return;
    }
    const randomT = Math.floor(Math.random() * this.themeText.length);
    return this.themeText[randomT];
  }


    // This method is responsible to reset panel
    public ResetThemePanel()
    {
         this.timeCounter = 5;
        GameManager.instance.theme = false;
        this.isCounterRunning = false; // Start the counter
        //const selectTheme = this.GetTextThemeRandom(); // Get a random theme 
       // this.selectThemeText.text = selectTheme; //    // Set text to the selectThemeText
    }

    public StartTheme() 
  {     this.timeCounter = 5;
    this.timeSlider.maxValue = GameManager.instance.customizationTimeTheme;   // Set the maximum value of the time slider from GameManager
    this.isCounterRunning = true; // Start the counter
    const selectTheme = this.GetTextThemeRandom(); // Get a random theme 
    this.selectThemeText.text = selectTheme; //    // Set text to the selectThemeText
  }
}