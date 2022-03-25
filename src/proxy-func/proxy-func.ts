import { postExecution } from '@execution/post-execution';
import { preExecution } from '@execution/pre-execution';
import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { MethodContainer } from '@aspect-types/method-container.type';


export function proxyFunc(
    target: any,
    methodName: string,
    methodContainer: MethodContainer,
    params: any[],
    ...args: any
): any {
    let modifiedArgs: any = undefined;

    const { originalMethod, adviceAspectMap } = methodContainer;
    const aspectCtx: AspectContext = {
        target: target,
        methodName: methodName,
        functionParams: args,
        params: params,
        returnValue: null,
        error: null,
    };
    
    modifiedArgs = preExecution(aspectCtx, adviceAspectMap);

    try {
        aspectCtx.returnValue = originalMethod.apply(target, modifiedArgs ?? args);
    } catch (error) {
        if (adviceAspectMap.has(Advice.TryCatch)) {
            adviceAspectMap.get(Advice.TryCatch)?.forEach(aspect => {
                aspectCtx.error = error;
                aspect.execute(aspectCtx);
            });
        } else {
            throw error;
        }
    } finally {
        if (adviceAspectMap.has(Advice.TryFinally)) {
            adviceAspectMap.get(Advice.TryFinally)?.forEach(aspect => {
                aspect.execute(aspectCtx);
            });
        }
    }

    postExecution(aspectCtx, adviceAspectMap);

    return aspectCtx.returnValue;
}
