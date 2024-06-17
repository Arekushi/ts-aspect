import { mock } from 'jest-mock-extended';
import { Advice } from '@enum/advice.enum';
import { Aspect, AspectContext } from '@interfaces/aspect.interface';
import { UseAspect } from '@decorator/use-aspect';

const beforeAspect = mock<Aspect>();
const afterAspect = mock<Aspect>();
const tryCatchAspect = mock<Aspect>();

class SampleClass {
    public constructor(
        private sampleId: number
    ) {}

    @UseAspect(Advice.Before, beforeAspect)
    @UseAspect(Advice.After, afterAspect)
    public getSampleId(): number {
        return this.sampleId;
    }

    @UseAspect(Advice.Before, beforeAspect)
    @UseAspect(Advice.After, afterAspect)
    @UseAspect(Advice.After, afterAspect)
    @UseAspect(Advice.AfterReturn, afterAspect)
    public setSampleId(sampleId: number): void {
        this.sampleId = sampleId;
    }

    @UseAspect(Advice.Before, beforeAspect)
    public multipleArgs(
        a: number,
        b: number,
        c: number
    ): void { }

    @UseAspect(Advice.Before, beforeAspect)
    @UseAspect(Advice.After, afterAspect)
    public throwError(): void {
        throw new Error('this is expected!');
    }

    @UseAspect(Advice.TryCatch, tryCatchAspect)
    public throwErrorWithTryCatch(): void {
        throw new Error('this is expected!');
    }
}

describe('UseAspect Decorator', () => {
    let sample = new SampleClass(0);

    beforeEach(() => {
        jest.clearAllMocks();
        sample = new SampleClass(0);
    });

    it('should execute the aspect annoted', () => {
        sample.getSampleId();

        const expectedCtx = {
            target: sample,
            methodName: 'getSampleId',
            functionParams: {},
            returnValue: 0,
            error: null
        };

        expect(beforeAspect.execute).toHaveBeenCalledTimes(1);
        expect(beforeAspect.execute).toHaveBeenCalledWith(
            expect.objectContaining(expectedCtx)
        );
    });

    it('should have correctly context object', () => {
        sample.multipleArgs(1, 2, 3);

        const expectedCtx: AspectContext = {
            target: sample,
            methodName: 'multipleArgs',
            functionParams: {
                a: 1, b: 2, c: 3
            },
            returnValue: undefined,
            error: null,
        };

        expect(beforeAspect.execute).toHaveBeenCalledWith(
            expect.objectContaining(expectedCtx)
        );
    });

    it('should execute all aspects annotated', () => {
        sample.setSampleId(123);
        expect(afterAspect.execute).toHaveBeenCalledTimes(3);
    });

    it('should not execute the aspect annotated with Advice.After if an error is thrown in method', () => {
        expect(() => sample.throwError()).toThrow(Error);
        expect(beforeAspect.execute).toHaveBeenCalledTimes(1);
        expect(afterAspect.execute).toHaveBeenCalledTimes(0);
    });

    it('should execute the aspect annoted with Advice.TryCatch', () => {
        sample.throwErrorWithTryCatch();
        expect(tryCatchAspect.execute).toHaveBeenCalledTimes(1);
    });

    describe('for async functions', () => {
        const aspectAfterReturn = mock<Aspect>();
        const aspectBefore = mock<Aspect>();
        const aspect = mock<Aspect>();

        aspectAfterReturn.execute.mockImplementation((ctx) => {
            return 42;
        });
        aspectBefore.execute.mockImplementation((ctx) => {
            return [42];
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it.each([
            [Advice.Before, 1, aspectBefore, 1337],
            [Advice.After, 1, aspect, 1337],
            [Advice.AfterReturn, 1, aspectAfterReturn, 42],
            [Advice.Around, 2, aspect, 1337],
            [Advice.TryFinally, 1, aspect, 1337],
        ])(
            'should execute the aspect at the advice %s annotated %d times',
            async (
                advice: Advice,
                numberOfCalls: number,
                aspect: Aspect,
                expectedReturnSampleId: number,
            ) => {
                class SampleClassAsync {
                    public constructor(public sampleId: number) {}

                    @UseAspect(advice, aspect)
                    public async getSampleIdAsync(): Promise<number> {
                        return this.sampleId;
                    }
                }

                const cls = new SampleClassAsync(1337);
                const sampleId = await cls.getSampleIdAsync();

                expect(aspect.execute).toHaveBeenCalledTimes(numberOfCalls);
                expect(sampleId).toBe(expectedReturnSampleId);
            },
        );

        it('should execute the aspect at the advice TryCatch', async () => {
            class SampleClassAsync {
                @UseAspect(Advice.TryCatch, aspect)
                public async getSampleIdAsync(): Promise<number> {
                    throw Error('throwing error for TryCatch Advice');
                }
            }

            const cls = new SampleClassAsync();
            const sampleId = await cls.getSampleIdAsync();

            expect(aspect.execute).toHaveBeenCalledTimes(1);
            expect(sampleId).toBe(null);
        });
    });

});
