
import { mock } from 'jest-mock-extended';

import { CalculatorCls } from './samples/CalculatorCls.sample';
import { Advice } from './../src/enum/advice.enum';
import { resetAllAspects } from './../src/functions/reset-all-aspects';
import { addAspect } from './../src/add/add-aspect';
import { Aspect } from './../src/interfaces/aspect.interface';


describe('resetAllAspects', () => {
    let calculator: CalculatorCls;
    const aspect = mock<Aspect>();

    beforeEach(() => {
        jest.clearAllMocks();

        calculator = new CalculatorCls();
    });

    it('should clear all registered aspects', () => {
        addAspect(calculator, 'add', Advice.Before, aspect);

        calculator.add(1, 2);

        resetAllAspects(calculator, 'add');

        calculator.add(4, 4);

        expect(aspect.execute).toHaveBeenCalledTimes(1);
    });
});
