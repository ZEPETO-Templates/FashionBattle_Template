import { GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIPanelGame from './UIPanelGame';

export default class VoteButton extends ZepetoScriptBehaviour 
{
    public selectedIMG : GameObject;
    public buttonIndex : number;

    public gamePanel : UIPanelGame;
    public voteButton : RoundedRectangleButton;

    Start() 
    {    
        if(this.buttonIndex == 0)
        {
            this.selectedIMG.SetActive(true);
        }
        else
        {
            this.selectedIMG.SetActive(false);
        }

        this.voteButton.OnClick.AddListener(()=>{
            
        });
    }

    public SetVoteSelection()
    {

    }

    public SetSelectedImg(value : boolean)
    {
        this.selectedIMG.SetActive(value);
    }
}