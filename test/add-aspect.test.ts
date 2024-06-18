import { addAspect } from '@add/add-aspect';
import { Advice } from '@enum/advice.enum';
import { Aspect, AspectContext } from '@interfaces/aspect.interface';
import { mock } from 'jest-mock-extended';
import { Calculator } from './samples/calculator.class';
import { SampleClassAsync } from './samples/sample-async.class';

describe('Add Aspect', () => {
    let calculator: Calculator;
    const aspect = mock<Aspect>();

    beforeEach(() => {
        jest.clearAllMocks();
        calculator = new Calculator();
    });

    it.each([
        [Advice.Before, 1],
        [Advice.After, 1],
        [Advice.AfterReturn, 1],
        [Advice.Around, 2],
        [Advice.TryCatch, 0],
        [Advice.TryFinally, 1],
    ])(
        'should execute the injected aspect as the recpective advice %s demands',
        (advice: Advice, expectedNumberOfCalls: number) => {
            addAspect(calculator, 'add', advice, aspect);
            calculator.add(1, 2);
            expect(aspect.execute).toHaveBeenCalledTimes(expectedNumberOfCalls);
        }
    );

    it.each([
        Advice.Before,
        Advice.After,
        Advice.AfterReturn,
        Advice.Around,
        Advice.TryCatch,
        Advice.TryFinally,
    ])(
        'should NOT execute the injected aspect if other methods are called',
        (advice: Advice) => {
            addAspect(calculator, 'add', advice, aspect);
            addAspect(calculator, 'divide', advice, aspect);

            calculator.subtract(1, 2);
            calculator.multiply(1, 2);

            expect(aspect.execute).not.toHaveBeenCalled();
        }
    );

    it.each([
        Advice.Before,
        Advice.After,
        Advice.Around,
        Advice.TryFinally
    ])(
        'should pass all parameters of the called function to the injected aspect',
        (advice: Advice) => {
            addAspect(calculator, 'add', advice, aspect, 'a');
            addAspect(calculator, 'add', Advice.After, aspect, 'b');
            calculator.add(1, 2);

            const expectedCtx: AspectContext = {
                target: calculator,
                methodName: 'add',
                functionParams: {
                    a: { index: 0, value: 1 },
                    b: { index: 1, value: 2 },
                },
                returnValue: 3,
                error: null,
            };

            expect(aspect.execute).toHaveBeenCalledWith(
                expect.objectContaining(expectedCtx)
            );
        },
    );

    it('should catch the error, pass the error and all function parameters to the injected aspect and execute it for Advice.TryCatch', () => {
        addAspect(calculator, 'divide', Advice.TryCatch, aspect);

        calculator.divide(1, 0);

        expect(aspect.execute).toHaveBeenCalledTimes(1);

        const expectedCtx: AspectContext = {
            target: calculator,
            methodName: 'divide',
            functionParams: {
                a: { index: 0, value: 1 },
                b: { index: 1, value: 0 }
            },
            returnValue: null,
            error: new Error('Division by zero!'),
        };

        expect(aspect.execute).toHaveBeenCalledWith(
            expect.objectContaining(expectedCtx)
        );
    });

    it('should pass the returned value to the injected aspect for Advice.AfterReturn', () => {
        aspect.execute.mockImplementationOnce((ctx: AspectContext) => {
            return ctx.returnValue;
        });

        addAspect(calculator, 'add', Advice.AfterReturn, aspect);
        calculator.add(1, 2);

        const expectedCtx: AspectContext = {
            target: calculator,
            methodName: 'add',
            functionParams: {
                a: { index: 0, value: 1 },
                b: { index: 1, value: 2}
            },
            returnValue: 3,
            error: null,
        };

        expect(aspect.execute).toHaveBeenCalledTimes(1);
        expect(aspect.execute).toHaveBeenCalledWith(
            expect.objectContaining(expectedCtx)
        );
    });

    it('should return the returned value manipulated by the injected aspect for Advice.AfterReturn', () => {
        aspect.execute.mockImplementationOnce((ctx: AspectContext) => {
            const returnValue = ctx.returnValue;
            return returnValue * 42;
        });

        addAspect(calculator, 'add', Advice.AfterReturn, aspect);

        const returnValue = calculator.add(1, 2);

        expect(returnValue).toBe(3 * 42);
    });

    it('should propagate thrown error in original method', () => {
        expect(() => calculator.divide(1, 0)).toThrow(Error);
    });

    it('should return correctly value using advice AfterReturn', () => {
        aspect.execute.mockImplementation((ctx: AspectContext): any => {
            return 1;
        });

        addAspect(calculator, 'add', Advice.AfterReturn, aspect);
        const value = calculator.add(1, 1);
        expect(value).toEqual(1);
    });

    describe('for async functions', () => {
        const aspectAfterReturn = mock<Aspect>();
        const aspectBefore = mock<Aspect>();
        const aspect = mock<Aspect>();

        aspectAfterReturn.execute.mockImplementation((ctx) => {
            return 42;
        });
        aspectBefore.execute.mockImplementation((ctx) => {});

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it.each([
            [Advice.Before, 1, aspectBefore, 1337],
            [Advice.After, 1, aspect, 1337],
            [Advice.AfterReturn, 1, aspectAfterReturn, 42],
            [Advice.Around, 2, aspect, 1337],
            [Advice.TryCatch, 0, aspect, 1337],
            [Advice.TryFinally, 1, aspect, 1337],
        ])(
            'should execute the aspect at the advice %s annotated %d times',
            async (
                advice: Advice,
                numberOfCalls: number,
                aspect: Aspect,
                expectedReturnSampleId: number,
            ) => {
                const sample = new SampleClassAsync(1337);
                addAspect(sample, 'getSampleIdAsync', advice, aspect);
                
                const sampleId = await sample.getSampleIdAsync();
                expect(sampleId).toBe(expectedReturnSampleId);
            }
        );
    });

});
