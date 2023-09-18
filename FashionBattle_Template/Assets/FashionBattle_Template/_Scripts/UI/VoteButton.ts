import { GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIPanelGame from './UIPanelGame';

export default class VoteButton extends ZepetoScriptBehaviour 
{
    public selectedIMG : GameObject; // Reference to the selected image
    public buttonIndex : number; // Reference to the button index

    public uiPanelGame : GameObject; // Reference to the ui panel game
    public voteButton : RoundedRectangleButton; // Reference to the vote button

    private _uiPanelGame: UIPanelGame; // This variable saves the UIPanelGame script

    // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
    Start() 
    {    
        // Saves the UIPanelGame Script
        this._uiPanelGame = this.uiPanelGame.GetComponent<UIPanelGame>();

        // By default we set all the stars off
        this.selectedIMG.SetActive(false);

        // Add action on click the main button
        this.voteButton.OnClick.AddListener(()=>{
            //Call to the function SetVoteSelection
            this._uiPanelGame.SetVoteSelection(this.buttonIndex);
        });
    }

    // This method is responsible to change state on selected image
    public SetSelectedImg(value : boolean)
    {
        this.selectedIMG.SetActive(value);
    }
}