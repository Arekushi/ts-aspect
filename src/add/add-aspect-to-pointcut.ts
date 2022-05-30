import { getPointcutMethods } from '@functions/get-pointcut-methods';
import { Aspect } from '@interfaces/aspect.interface';
import { Advice } from '@enum/advice.enum';
import { addAspect } from '@add/add-aspect';


export function addAspectToPointcut(
    target: any,
    pointcut: string,
    advice: Advice,
    aspect: Aspect,
    params: any = null
): void {
    const methods = getPointcutMethods(target, pointcut);

    methods.forEach(method => {
        addAspect(target, method, advice, aspect, params);
    });
}
