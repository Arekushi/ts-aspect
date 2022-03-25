import { AspectContext } from '@interfaces/aspect.interface';
import { Advice } from '@enum/advice.enum';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';


export const asyncPostExecution = async (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): Promise<any> => {
    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(async (aspect) => {
            await aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.After)) {
        adviceAspectMap.get(Advice.After)?.forEach(async (aspect) => {
            await aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.AfterReturn)) {
        adviceAspectMap.get(Advice.AfterReturn)?.forEach(async (aspect) => {
            aspectCtx.returnValue = await aspect.execute(aspectCtx);
        });
    }
};
