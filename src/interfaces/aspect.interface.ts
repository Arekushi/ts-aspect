import { Advice } from '@enum/advice.enum';
import { IndexedKeyValuePair } from '@interfaces/key-value.interface';


export interface Aspect {
    execute(ctx: AspectContext): any;
}

export interface AspectContext {
    target: any;
    methodName: string;
    functionParams: IndexedKeyValuePair;
    returnValue: any;
    error: any;
    advice?: Advice;
    params?: any;
}
