import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonAnimation')
export class ButtonAnimation extends Component {

    @property(Animation)
    animation:Animation;

    onShowComplete()
    {
        this.animation.play("buttonNormal");
    }
}


