import { _decorator, Button, Color, Component, EditBox, EventHandler, instantiate, Label, Node, Prefab, Sprite, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const blockWidth:number = 50;
const blockHeight:number = 50;
const MER_PROB = 20;
const COLOR_ARRAY:Color[] = [new Color(255,0,0, 255),  new Color(0,255,0, 255),new Color(0,0,255, 255),new Color(255,255,0, 255),new Color(0,255,255, 255)];
const CLASS_NAME = "HCTest"

@ccclass('HCTest')
export class HCTest extends Component {

    @property(Button)
    makeMatrixBtn:Button;
    @property(Prefab)
    cell:Prefab;
    @property(Node)
    cellRoot:Node;

    @property(EditBox)
    xEditor:EditBox;
    @property(EditBox)
    yEditor:EditBox;

    @property(Label)
    tip:Label;

    private probabilities:number[]; //概率值
    private tempProb = [0,0,0,0,0];
    private generColorArrays:number[][];   //生成的Color

    private cellGroups : Sprite[][];

    private mProbX = 0;
    private mProbY = 0;

    

    constructor(){
        super();
        this.probabilities = [20, 40, 60 ,80 ,100];
        this.cellGroups = [];
        this.generColorArrays = [];
    }
    protected onLoad(): void {
        
        let makeMatrixHandler = new EventHandler();
        makeMatrixHandler.target = this.node;
        makeMatrixHandler.component = CLASS_NAME;
        makeMatrixHandler.handler = "onMakeMatrix";
        this.makeMatrixBtn.clickEvents.push(makeMatrixHandler);
    }

    onMakeMatrix()
    {
        this.tip.string = "";

        if(this.cellGroups.length == 0)
        {
            //创建cell 不必每次都创建
            this.createCells();
        }

        let xStr = this.xEditor.string;
        let x = parseInt(xStr);
        if(isNaN(x) || x < 0 || x > 80)
        {
            //提示输入的信息不正确
            this.tip.string = "输入的X值应当大于0小于80";
            return;
        }
        this.mProbX = x;

        let yStr = this.yEditor.string;
        let y = parseInt(xStr);
        if(isNaN(y) || y < 0 || y > 80)
        {
            //提示输入的信息不正确
            this.tip.string = "输入的Y值应当大于0小于80";
            return;
        }
        this.mProbY = y;


        if(x > 30)
        {
            this.tip.string = "X大于30会可能会其他颜色概率为0的情况";
        }

        this.calculateColors();
        
        this.fillCells();

    }

    calculateColors()
    {
        this.probabilities = [20, 40, 60 ,80 ,100];
        for(let i = 0; i < 10; i ++)
        {
            for(let j = 0; j < 10; j++)
            {
                let left = i - 1;
                let up = j - 1;
                
                if(this.generColorArrays[left] && this.generColorArrays[i][up])
                {
                    //上边和左边都有的情况
                    if(this.generColorArrays[left][j] == this.generColorArrays[i][up])
                    {
                        let idx = this.generColorArrays[left][j];
                        this.calAndSetProb(idx, 20 + this.mProbY);
                    }
                    else
                    {
                        let idx = this.generColorArrays[left][j];
                        let idx2 = this.generColorArrays[i][up];
                        this.calAndSetProb(idx, 20 + this.mProbX, idx2, this.mProbX);
                    }

                }
                else if (this.generColorArrays[left])
                {
                    let idx = this.generColorArrays[left][j];
                    this.calAndSetProb(idx, 20 + this.mProbX);
                }
                else if (this.generColorArrays[i][up])
                {
                    let idx = this.generColorArrays[i][up];
                    this.calAndSetProb(idx, 20 + this.mProbX);
                }
                else
                {
                    //第一个

                    this.calAndSetProb();

                }

                let colorIdx = this.rollAColor();
                this.generColorArrays[i][j] = colorIdx;
                console.log(`color:[${i}][${j}] = ${colorIdx}`);
            }
        }
    }

    //检查是否相同，并设置概率
    calAndSetProb(idx1?:number, prob1?:number, idx2?:number, prob2?:number)
    {
        if(idx1 && idx2)
        {
            let d = (100 - prob1 - prob2) / 3;
            d = d < 0 ?0:d;
            for (let i = 0; i < 5; i ++)
            {
                this.tempProb[i] = d;
            }
            this.tempProb[idx1] = prob1;
            this.tempProb[idx2] = prob2;
        }
        else if (idx1)
        {
            let d = (100 - prob1) / 4;
            d = d < 0 ?0:d;
            for (let i = 0; i < 5; i ++)
            {
                this.tempProb[i] = d;
            }

            this.tempProb[idx1] = prob1;
        }
        else
        {
            for (let i = 0; i < 5; i ++)
            {
                this.tempProb[i] = 20;
            }
        }

        this.setProb(this.tempProb);
    }

    setProb(prob1:number[])
    {
        this.probabilities[0] = prob1[0];
        this.probabilities[1] = this.probabilities[0] + prob1[1];
        this.probabilities[2] = this.probabilities[1] + prob1[2];
        this.probabilities[3] = this.probabilities[2] + prob1[3];
        this.probabilities[4] = this.probabilities[3] + prob1[4];
    }

    rollAColor():number
    {
        let randomNumber: number = Math.floor(Math.random() * 101);
        for(let i = 0; i < 5; i++)
        {
            if(randomNumber <= this.probabilities[i])
            {
                console.log("index =====" + i);
                return i;
            }
        }
        //超出的按照最后一个算
        return 4;
    }

    fillCells()
    {
        for(let i = 0; i < 10; i ++)
        {
            for (let j = 0; j < 10; j++)
            {
                let cIdx = this.generColorArrays[i][j];

                let sprite = this.cellGroups[i][j];

                sprite.color = COLOR_ARRAY[cIdx];
            }
        }
    }

    createCells()
    {
        for(let i = 0; i < 10; i++)
        {
            this.cellGroups[i] = [];
            this.generColorArrays[i] = [];
            for(let j = 0; j < 10; j++)
            {
                let cellNode = instantiate(this.cell);
                this.cellGroups[i][j] = cellNode.getComponent(Sprite);
                this.cellRoot.addChild(cellNode);
                this.generColorArrays[i][j] = 0;
            }
        }
    }
}


