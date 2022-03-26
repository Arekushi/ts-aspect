import { Advice } from '@enum/advice.enum';
import { AspectContext } from '@interfaces/aspect.interface';
import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';


export const asyncPreExecution = async (
    aspectCtx: AspectContext,
    adviceAspectMap: AdviceAspectMap,
): Promise<any> => {
    let modifiedArgs: any = undefined;

    if (adviceAspectMap.has(Advice.Before)) {
        adviceAspectMap.get(Advice.Before)?.forEach(async (aspect) => {
            modifiedArgs = await aspect.execute(aspectCtx);
        });
    }

    if (adviceAspectMap.has(Advice.Around)) {
        adviceAspectMap.get(Advice.Around)?.forEach(async (aspect) => {
            modifiedArgs = await aspect.execute(aspectCtx);
        });
    }

    return modifiedArgs;
};
