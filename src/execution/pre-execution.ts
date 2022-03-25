import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';


export const preExecution = (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): any => {
    if (adviceAspectMap.has(Advice.Before)) {
        adviceAspectMap.get(Advice.Before)?.forEach(aspect => {
            return aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(aspect => {
            return aspect.execute(aspectCtx);
        });
    }
};
