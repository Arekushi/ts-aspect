import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { MethodContainer } from '@aspect-types/method-container.type';
import { asyncPreExecution } from '@execution/async-pre-execution';
import { asyncPostExecution } from '@execution/async-post-execution';


export async function asyncProxyFunc(
    target: any,
    methodName: string,
    methodContainer: MethodContainer,
    params: any,
    ...args: any
): Promise<any> {
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

    modifiedArgs = await asyncPreExecution(aspectCtx, adviceAspectMap);

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

    await asyncPostExecution(aspectCtx, adviceAspectMap);

    return aspectCtx.returnValue;
}
