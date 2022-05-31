import { types } from 'util';
import { asyncProxyFunc } from '@proxy-func/async-proxy-func';
import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { proxyFunc } from '@proxy-func/proxy-func';
import { getTsAspectProp, setTsAspectProp } from '@functions/ts-aspect-property';
import { AspectValues } from '@aspect-types/aspect-values.type';


export const UseAspect = (
    advice: Advice,
    aspect: Aspect | (new () => Aspect),
    params?: any
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
                adviceAspectMap: new Map<Advice, AspectValues[]>(),
            };

            descriptor.value = function(...args: any) {
                const container = getTsAspectProp(target);

                if (container) {
                    if (types.isAsyncFunction(originalMethod)) {
                        return asyncProxyFunc(
                            this,
                            propertyKeyString,
                            container[propertyKeyString],
                            ...args,
                        );
                    } else {
                        return proxyFunc(
                            this,
                            propertyKeyString,
                            container[propertyKeyString],
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

        const aspectValues: AspectValues = {
            aspect: typeof aspect === 'function' ? new aspect() : aspect,
            advice,
            params
        };

        adviceAspectMap.get(advice)?.push(aspectValues);
    };
};
