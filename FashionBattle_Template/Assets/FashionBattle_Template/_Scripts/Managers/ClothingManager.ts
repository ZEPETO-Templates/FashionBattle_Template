import { GameObject } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class ClothingManager extends ZepetoScriptBehaviour 
{
  public static instance: ClothingManager;

  @Header("Items for each part (itemId)")
  public headItems: string[];
  public chestItems: string[];
  public legsItems: string[];
  public shoesItems: string[];

  Awake() 
  {
    // Singleton pattern
    if (ClothingManager.instance != null) GameObject.Destroy(this.gameObject);
    else ClothingManager.instance = this;
  }

}
