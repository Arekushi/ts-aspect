import { postExecution } from '@execution/post-execution';
import { preExecution } from '@execution/pre-execution';
import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { MethodContainer } from '@aspect-types/method-container.type';


export async function asyncProxyFunc(
    target: any,
    methodName: string,
    methodContainer: MethodContainer,
    ...args: any
): Promise<any> {
    let modifiedArgs: any = undefined;

    const { originalMethod, adviceAspectMap } = methodContainer;
    const aspectCtx: AspectContext = {
        target,
        methodName,
        functionParams: args,
        returnValue: null,
        error: null,
    };

    modifiedArgs = preExecution(aspectCtx, adviceAspectMap);

    try {
        aspectCtx.returnValue = await originalMethod.apply(target, modifiedArgs ?? args);
    } catch (error) {
        if (adviceAspectMap.has(Advice.TryCatch)) {
            adviceAspectMap.get(Advice.TryCatch)?.forEach(values => {
                aspectCtx.error = error;
                aspectCtx.advice = values.advice;
                aspectCtx.params = values.params;
                values.aspect.execute(aspectCtx);
            });
        } else {
            throw error;
        }
    } finally {
        if (adviceAspectMap.has(Advice.TryFinally)) {
            adviceAspectMap.get(Advice.TryFinally)?.forEach(values => {
                aspectCtx.advice = values.advice;
                aspectCtx.params = values.params;
                values.aspect.execute(aspectCtx);
            });
        }
    }

    postExecution(aspectCtx, adviceAspectMap);

    return aspectCtx.returnValue;
}
