import { mock } from 'jest-mock-extended';

import { Calculator } from './samples/calculator.class';
import { Advice } from '@enum/advice.enum';
import { Aspect } from '@interfaces/aspect.interface';
import { addAspectToPointcut } from '@add/add-aspect-to-pointcut';


describe('addAspectToPointcut', () => {
    let calculator: Calculator;
    const aspect = mock<Aspect>();

    beforeEach(() => {
        jest.clearAllMocks();
        calculator = new Calculator();
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
