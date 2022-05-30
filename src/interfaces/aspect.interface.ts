import { Advice } from '@enum/advice.enum';


export interface Aspect {
    execute(ctx: AspectContext): any;
}

export interface AspectContext {
    target: any;
    methodName: string;
    functionParams: any[];
    returnValue: any;
    error: any;
    advice: Advice;
    params?: any;
}
