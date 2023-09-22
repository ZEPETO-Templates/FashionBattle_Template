import { GameObject } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class ClothingManager extends ZepetoScriptBehaviour 
{
  public static instance: ClothingManager; // Singleton instance variable

  @Header("Items for each part (itemId)")
  public headItems: string[]; // This variable saves all the hats identifiers
  public chestItems: string[]; // This variable saves all the chest identifiers
  public legsItems: string[]; // This variable saves all the legs identifiers
  public shoesItems: string[]; // This variable saves all the shoes identifiers

  // Awake is called when an enabled script instance is being loaded.
  Awake() 
  {
    // Singleton pattern
    if (ClothingManager.instance != null) GameObject.Destroy(this.gameObject);
    else ClothingManager.instance = this;
  }

}
