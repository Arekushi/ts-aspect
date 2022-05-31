import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';


export const preExecution = (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): any => {
    let modifiedArgs: any = undefined;

    if (adviceAspectMap.has(Advice.Before)) {
        adviceAspectMap.get(Advice.Before)?.forEach(values => {
            aspectCtx.advice = values.advice;
            aspectCtx.params = values.params;
            modifiedArgs = values.aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(values => {
            aspectCtx.advice = values.advice;
            aspectCtx.params = values.params;
            modifiedArgs = values.aspect.execute(aspectCtx);
        });
    }

    return modifiedArgs;
};
