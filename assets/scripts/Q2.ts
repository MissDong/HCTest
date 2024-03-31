import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Q2')
export class Q2 extends Component {

    protected onEnable(): void {
        
    }

    onCalculate()
    {
        let a = [10, 40, 5, 280];
        let b = [234, 5, 2, 148, 23];
        let v = 42;
        let ret = this.isArraySumEqu(a, b, v);
        console.log(ret);
    }

    isArraySumEqu(a:number[], b:number[], v:number):boolean
    {
        //将a转为map 时间复杂度O(m)
        const map = new Map<number, boolean>();
        for (const num of a) {
            map.set(num, true);
        }


        //遍历b数组，相减之后查看是否在amap中。 时间复杂度O(n). hash查找时间复杂度为O(1)
        for (const num of b) {
            const complement = v - num;
            if (map.has(complement)) {
                return true;
            }
        }

        //综上 时间复杂度为:1、转换Map:O(m) 2、遍历b数组 : O(n), 3、hash查找:O(1) 总的时间复杂度为O(m+n)
        return false;
    }
}


