import { _decorator, Animation, animation, Button, Component, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Q3')
export class Q3 extends Component {

    @property(Button)
    playBtn:Button;
    @property(Animation)
    btnAnimation:Animation;
    @property(Animation)
    btnParentAnimation:Animation;
    @property(Node)
    btnParent:Node;

    protected onLoad(): void {
        this.playBtn.node.on(Node.EventType.TOUCH_START, this.onBtnPressEvent, this);
        this.playBtn.node.on(Node.EventType.TOUCH_END, this.onBtnReleaseEvent, this);
        this.playBtn.node.on(Node.EventType.TOUCH_CANCEL, this.onBtnReleaseEvent, this);
    }

    protected onEnable(): void {
        this.btnAnimation.play("buttonShow");
    }

    onBtnPressEvent(event: Event, customEventData: string)
    {
        this.btnParentAnimation.play("btnPress");
    }
    onBtnReleaseEvent()
    {
        this.btnParentAnimation.play("btnRelease");
    }
}


