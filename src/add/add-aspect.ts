import { types } from 'util';
import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { setTsAspectProp, getTsAspectProp } from '@functions/ts-aspect-property';
import { asyncProxyFunc } from '@proxy-func/async-proxy-func';
import { proxyFunc } from '@proxy-func/proxy-func';


export const addAspect = (
    target: any,
    methodName: string,
    advice: Advice,
    aspect: Aspect,
    params: any = undefined
): void => {
    let tsAspectProp = getTsAspectProp(target);

    if (!tsAspectProp) {
        tsAspectProp = {};
        setTsAspectProp(target, tsAspectProp);
    }

    if (!tsAspectProp[methodName]) {
        const originalMethod = Reflect.get(target, methodName);

        tsAspectProp[methodName] = {
            originalMethod,
            adviceAspectMap: new Map<Advice, Aspect[]>(),
        };

        const wrapperFunc = (...args: any): any => {
            const tsAspectProp = getTsAspectProp(target);

            if (tsAspectProp) {
                if (types.isAsyncFunction(originalMethod)) {
                    return asyncProxyFunc(target, methodName, tsAspectProp[methodName], params, ...args);
                } else {
                    return proxyFunc(target, methodName, tsAspectProp[methodName], params, ...args);
                }
            }

            return originalMethod(...args);
        };

        Reflect.set(target, methodName, wrapperFunc);
    }

    const { adviceAspectMap } = tsAspectProp[methodName];

    if (!adviceAspectMap.has(advice)) {
        adviceAspectMap.set(advice, []);
    }

    adviceAspectMap.get(advice)?.push(aspect);
}
