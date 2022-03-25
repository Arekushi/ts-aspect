import { AdviceAspectMap } from '@aspect-types/advice-aspect-map.type';

export type MethodContainer = {
    originalMethod: any;
    adviceAspectMap: AdviceAspectMap;
};
