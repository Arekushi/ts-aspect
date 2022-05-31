import { AspectContext } from '@interfaces/aspect.interface';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';
import { Advice } from '@enum/advice.enum';


export const postExecution = (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): void => {
    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(values => {
            aspectCtx.advice = values.advice;
            aspectCtx.params = values.params;
            values.aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.After)) {
        adviceAspectMap.get(Advice.After)?.forEach(values => {
            aspectCtx.advice = values.advice;
            aspectCtx.params = values.params;
            values.aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.AfterReturn)) {
        adviceAspectMap.get(Advice.AfterReturn)?.forEach(values => {
            aspectCtx.advice = values.advice;
            aspectCtx.params = values.params;
            aspectCtx.returnValue = values.aspect.execute(aspectCtx);
        });
    }
};
