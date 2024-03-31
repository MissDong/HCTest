import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SwichScene')
export class SwichScene extends Component {

    onSwitchScene(event:Event, eventData:string)
    {
        director.loadScene(eventData);
    }
}


