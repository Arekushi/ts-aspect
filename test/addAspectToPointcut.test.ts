import { mock } from 'jest-mock-extended';

import { CalculatorCls } from './samples/CalculatorCls.sample';
import { Advice } from './../src/enum/advice.enum';
import { Aspect } from './../src/interfaces/aspect.interface';
import { addAspectToPointcut } from './../src/add/add-aspect-to-pointcut';


describe('addAspectToPointcut', () => {
    let calculator: CalculatorCls;
    const aspect = mock<Aspect>();

    beforeEach(() => {
        jest.clearAllMocks();

        calculator = new CalculatorCls();
    });

    it('should add aspect to all methods matching pointcut "i"', () => {
        addAspectToPointcut(calculator, 'i', Advice.Before, aspect);

        calculator.add(1, 2);
        calculator.subtract(1, 2);
        calculator.multiply(1, 2);
        calculator.divide(1, 2);

        expect(aspect.execute).toHaveBeenCalledTimes(2);
    });
});
