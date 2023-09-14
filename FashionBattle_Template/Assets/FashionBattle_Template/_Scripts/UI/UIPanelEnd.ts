import { TMP_Text } from 'TMPro';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';

// This class controls the view of the endgame panel
export default class UIPanelEnd extends ZepetoScriptBehaviour 
{
    public winnerName: TMP_Text; // Winner Name text reference
    public winnerScore: TMP_Text; // Winner Score text reference

    public restartButton: RoundedRectangleButton; // Restart button reference

    // Start is called on the frame when a script is enabled just before any of the Update methods is called the first time
    Start()
    {
    // The call to the method to restart the game is assigned to the button event
        this.restartButton.OnClick.AddListener(() => 
        {
            GameManager.instance.RestartGame();
        });        
    }

    // This method set the name and the winner's score
    public SetEndPanelData(winnername: string, winnerscore: string)
    {
    // Set the name of the winner to the winnerName text element.
        this.winnerName.text = winnername;

        // Set the winner's score to the winnerScore text element, with an additional message
        this.winnerScore.text = "Score: " + winnerscore + "!";
    }
}