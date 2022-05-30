import { getTsAspectProp } from '@functions/ts-aspect-property';


export const resetAllAspects = (target: any, methodName: string): void => {
    const tsAspectProp = getTsAspectProp(target);

    if (tsAspectProp && tsAspectProp[methodName]) {
        tsAspectProp[methodName].adviceAspectMap.clear();
    }
};
