import { types } from 'util';
import { asyncProxyFunc } from '@proxy-func/async-proxy-func';
import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { proxyFunc } from '@proxy-func/proxy-func';
import { getTsAspectProp, setTsAspectProp } from '@functions/ts-aspect-property';


export const UseAspect = (
    advice: Advice,
    aspect: Aspect | (new () => Aspect),
    params: any = null
): MethodDecorator => {
    return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        let tsAspectProp = getTsAspectProp(target);

        if (!tsAspectProp) {
            tsAspectProp = {};
            setTsAspectProp(target, tsAspectProp);
        }

        const propertyKeyString = propertyKey.toString();

        if (!tsAspectProp[propertyKeyString]) {
            const originalMethod = descriptor.value;

            tsAspectProp[propertyKeyString] = {
                originalMethod,
                adviceAspectMap: new Map<Advice, Aspect[]>(),
            };

            descriptor.value = function(...args: any) {
                const container = getTsAspectProp(target);

                if (container) {
                    if (types.isAsyncFunction(originalMethod)) {
                        return asyncProxyFunc(
                            this,
                            propertyKeyString,
                            advice,
                            container[propertyKeyString],
                            params,
                            ...args,
                        );
                    } else {
                        return proxyFunc(
                            this,
                            propertyKeyString,
                            advice,
                            container[propertyKeyString],
                            params,
                            ...args,
                        );
                    }
                }

                return originalMethod(...args);
            };
        }

        const { adviceAspectMap } = tsAspectProp[propertyKeyString];

        if (!adviceAspectMap.has(advice)) {
            adviceAspectMap.set(advice, []);
        }

        const aspectObj = typeof aspect === 'function' ? new aspect() : aspect;
        adviceAspectMap.get(advice)?.push(aspectObj);
    };
};
