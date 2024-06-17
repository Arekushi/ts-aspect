import { types } from 'util';
import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { setTsAspectProp, getTsAspectProp } from '@functions/ts-aspect-property';
import { asyncProxyFunc } from '@proxy-func/async-proxy-func';
import { proxyFunc } from '@proxy-func/proxy-func';
import { AspectValues } from '@aspect-types/aspect-values.type';
import { convertToObj, getParameterNames } from '@functions/method-params';


export const addAspect = (
    target: any,
    methodName: string,
    advice: Advice,
    aspect: Aspect,
    params?: any
): void => {
    let tsAspectProp = getTsAspectProp(target);

    if (!tsAspectProp) {
        tsAspectProp = {};
        setTsAspectProp(target, tsAspectProp);
    }

    if (!tsAspectProp[methodName]) {
        const originalMethod = Reflect.get(target, methodName);
        const parameterNames = getParameterNames(originalMethod);

        tsAspectProp[methodName] = {
            originalMethod,
            adviceAspectMap: new Map<Advice, AspectValues[]>(),
        };

        const wrapperFunc = (...args: any): any => {
            const container = getTsAspectProp(target);

            if (container) {
                const functionParams = convertToObj(parameterNames, args);

                if (types.isAsyncFunction(originalMethod)) {
                    return asyncProxyFunc(
                        target,
                        methodName,
                        container[methodName],
                        functionParams
                    );
                } else {
                    return proxyFunc(
                        target,
                        methodName,
                        container[methodName],
                        functionParams
                    );
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

    adviceAspectMap.get(advice)?.push({
        aspect,
        advice,
        params
    });
};
