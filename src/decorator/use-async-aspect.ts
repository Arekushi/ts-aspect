import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { getTsAspectProp, setTsAspectProp } from '@functions/ts-aspect-property';
import { asyncProxyFunc } from '@proxy-func/async-proxy-func';


export const UseAsyncAspect = async (
    advice: Advice,
    aspect: Aspect | (new () => Aspect),
    params: any = undefined
): Promise<MethodDecorator> => {
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

            descriptor.value = async function (...args: any): Promise<any> {
                const tsAspectProp = getTsAspectProp(target);

                if (tsAspectProp) {
                    return await asyncProxyFunc(
                        this,
                        propertyKeyString,
                        tsAspectProp[propertyKeyString],
                        params,
                        ...args,
                    );
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
