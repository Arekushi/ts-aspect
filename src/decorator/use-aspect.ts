import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { getTsAspectProp, setTsAspectProp } from '@functions/ts-aspect-property';
import { proxyFunc } from '@proxy-func/proxy-func';


export const UseAspect = (
    advice: Advice,
    aspect: Aspect | (new () => Aspect),
    ...params: any[]
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

            descriptor.value = (...args: any): any => {
                const tsAspectProp = getTsAspectProp(target);

                if (tsAspectProp) {
                    return proxyFunc(
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
