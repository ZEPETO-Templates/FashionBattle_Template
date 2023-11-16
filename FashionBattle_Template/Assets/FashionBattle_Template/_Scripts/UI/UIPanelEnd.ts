import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';
import { ZepetoText } from 'ZEPETO.World.Gui';

// This class controls the view of the endgame panel
export default class UIPanelEnd extends ZepetoScriptBehaviour 
{
    public winnerName: ZepetoText; // Winner Name text reference
    public winnerScore: ZepetoText; // Winner Score text reference

    public restartButton: Button; // Restart button reference

    // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
    Start()
    {
    // The call to the method to restart the game is assigned to the button event
        this.restartButton.onClick.AddListener( () => {
            this.OnClick();
        } );
    }

    OnClick (): void { 
            GameManager.instance.RestartGame();
        };       
         
    // This method set the name and the winner's score
    public SetEndPanelData(winnername: string, winnerscore: string)
    {
    // Set the name of the winner to the winnerName text element.
        this.winnerName.text = winnername;

        // Set the winner's score to the winnerScore text element, with an additional message
        this.winnerScore.text = "Score: " + winnerscore + "!";
    }
}