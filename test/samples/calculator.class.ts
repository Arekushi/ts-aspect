export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }

    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Division by zero!');
        }

        return a / b;
    }
}

export class AdvancedCalculator extends Calculator {
    sum(arr: number[]): number {
        return arr.reduce((acc, val) => acc + val, 0);
    }
}
