import { Debug } from 'UnityEngine';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';
import { UIPanelType } from '../Managers/UIManager';
import UIPanel from './UIPanel';

export default class UIPanelStart extends UIPanel
{
    @Header("Buttons")
    @SerializeField() playBtn: RoundedRectangleButton; // Reference to the play button

    Start()
    {
        this.playBtn.OnClick.AddListener(() => {
            Debug.LogError("TEST");
        });
    }

}