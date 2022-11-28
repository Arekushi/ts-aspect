import { mock } from 'jest-mock-extended';
import { Aspect, AspectContext } from '@interfaces/aspect.interface';
import { Advice } from '@enum/advice.enum';
import { UseAspect } from '@decorator/use-aspect';


describe('for async functions', () => {
    const aspect = mock<Aspect>();

    aspect.execute.mockImplementation(async (ctx: AspectContext) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([...ctx.functionParams]);
            }, 5000);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        [Advice.Before, 10]
    ])(
        '',
        async (
            advice: Advice,
            expectedNumber: number
        ) => {
            class SampleClassAsync {
                public constructor() { }

                @UseAspect(advice, aspect)
                public async getSampleIdAsync(id: number): Promise<number> {
                    await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(null);
                        }, 0);
                    });
                    return id;
                }
            }

            const obj = new SampleClassAsync();
            const response = await obj.getSampleIdAsync(expectedNumber);
            expect(response).toBe(expectedNumber);
        }
    );
});
