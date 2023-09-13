import { TMP_Text } from 'TMPro';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';

export default class UIPanelEnd extends ZepetoScriptBehaviour 
{
    public winnerName: TMP_Text;
    public winnerScore: TMP_Text;

    public restartButton: RoundedRectangleButton;

    Start()
    {
        this.restartButton.OnClick.AddListener(() => 
        {
            GameManager.instance.RestartGame();
        });        
    }

    public SetEndPanelData(winnername: string, winnerscore: string)
    {
        this.winnerName.text = winnername;
        this.winnerScore.text = "Score: " + winnerscore + "!";
    }
}