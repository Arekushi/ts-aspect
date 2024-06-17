import { TsAspectContainer } from '@aspect-types/aspect-container.type';

const tsAspectPropName = 'ts_aspect_obj';

export const getTsAspectProp = (target: any): TsAspectContainer | undefined => {
    return Reflect.get(target, tsAspectPropName);
};

export const setTsAspectProp = (target: any, tsAspectProp: TsAspectContainer): boolean => {
    return Reflect.set(target, tsAspectPropName, tsAspectProp);
};
