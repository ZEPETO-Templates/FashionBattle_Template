import { GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import UIPanelGame from './UIPanelGame';

export default class VoteButton extends ZepetoScriptBehaviour 
{
    public selectedIMG : GameObject;
    public buttonIndex : number;

    public uiPanelGame : GameObject;
    public voteButton : RoundedRectangleButton;

    private _uiPanelGame: UIPanelGame;

    Start() 
    {    
        this._uiPanelGame = this.uiPanelGame.GetComponent<UIPanelGame>();

        // By default we set all the stars on
        this.selectedIMG.SetActive(true);

        this.voteButton.OnClick.AddListener(()=>{
            this._uiPanelGame.SetVoteSelection(this.buttonIndex);
        });
    }

    public SetSelectedImg(value : boolean)
    {
        this.selectedIMG.SetActive(value);
    }
}