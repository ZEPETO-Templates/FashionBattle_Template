import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui'
import VoteButton from './VoteButton';

export default class UIPanelGame extends ZepetoScriptBehaviour 
{
    public voteButtons : RoundedRectangleButton[];
    
    Start() {    

    }

    public OnVoteSelection(voteIndex : number)
    {
        this.SetVoteSelection(voteIndex);
        this.voteButtons.forEach(element => {
            let voteButton = element.GetComponent<VoteButton>();
            if (voteButton.buttonIndex <= voteIndex)
            {
                voteButton.SetSelectedImg(true);
            }
            else
            {
                voteButton.SetSelectedImg(false);
            }
        });
    }

    public SetVoteSelection(voteIndex: number)
    {
        let voteSelection = voteIndex + 1;
    }

}