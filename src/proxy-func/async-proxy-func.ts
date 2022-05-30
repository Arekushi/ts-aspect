import { postExecution } from '@execution/post-execution';
import { preExecution } from '@execution/pre-execution';
import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { MethodContainer } from '@aspect-types/method-container.type';


export async function asyncProxyFunc(
    target: any,
    methodName: string,
    advice: Advice,
    methodContainer: MethodContainer,
    params: any,
    ...args: any
): Promise<any> {
    const { originalMethod, adviceAspectMap } = methodContainer;
    const aspectCtx: AspectContext = {
        target,
        methodName,
        advice,
        functionParams: args,
        params,
        returnValue: null,
        error: null,
    };

    const modifiedArgs = preExecution(aspectCtx, adviceAspectMap);

    try {
        aspectCtx.returnValue = await originalMethod.apply(target, modifiedArgs ?? args);
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
