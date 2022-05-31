import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';


export type AspectValues = {
    aspect: Aspect;
    advice: Advice;
    params: any;
};
