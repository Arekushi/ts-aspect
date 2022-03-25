import { AspectContext } from '@interfaces/aspect.interface';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';
import { Advice } from '@enum/advice.enum';


export const postExecution = (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): void => {
    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(aspect => {
            aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.After)) {
        adviceAspectMap.get(Advice.After)?.forEach(aspect => {
            aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.AfterReturn)) {
        adviceAspectMap.get(Advice.AfterReturn)?.forEach(aspect => {
            aspectCtx.returnValue = aspect.execute(aspectCtx);
        });
    }
};
