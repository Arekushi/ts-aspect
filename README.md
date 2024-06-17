<h1 align="center">
    TS-Aspect
</h1>

<p align="center">
    A simplistic library for <b>A</b>spect <b>O</b>riented <b>P</b>rogramming (AOP) in TypeScript. Aspects can be injected on pointcuts via regular expressions for a <b>class</b> or <b>object</b>.
    <br>
    <br>
    One application of AOP is the encapsulation of cross-cutting concerns, like logging, and keep the original business logic clean. Although a powerful tool, it should be used with care as it hides logic and complexity.
</p>

## About this library
This is a fork of the [ts-aspect][source_repo] library, and I created it with the purpose of making new additions to the library, implementing improvements, and continuing to support this tool that has incredible potential in medium-short projects.

## Installation
To get started, install `@arekushii/ts-aspect` with npm.
```
npm i @arekushii/ts-aspect
```

## Usage
An aspect can be injected to the `target` class instance or object via
```javascript
function addAspect(
    target: any,
    methodName: string,
    advice: Advice,
    aspect: Aspect,
    params: any
): void
```
or
```javascript
function addAspectToPointcut(
    target: any,
    pointcut: string,
    advice: Advice,
    aspect: Aspect,
    params: any
): void
```
The `aspect` parameter is the actual behavior that extends the `target` code. When the `aspect` is about to be executed is defined by the `advice` parameter. Currently, the following advices are available:
```typescript
export enum Advice {
    // executed before the method
    Before,

    // executed after the method
    After,

    // executed both before and after the method
    Around,

    // executed after the method, with access to its return value
    AfterReturn,

    // executed after the method throws an exception
    TryCatch,

    // executed in the Finally code block
    TryFinally,
}
```

Aspects await the execution of asynchronous functions - and are asynchronous themselves in this case. This enables an aspect for the advices Advice.After, Advice.AfterReturn and at the second execution of Advice.Around to work with the resolved return value of the injected function.

Also, `ts-aspect` provides a method decorator to attach an aspect to a all instances of a class in a declarative manner:
```javascript
function UseAspect(
    advice: Advice,
    aspect: Aspect | (new () => Aspect),
    params?: any
): MethodDecorator
```

## Example without Decorator
Assume the following aspect class which simply logs the current aspect context passed to it to the console: 
```typescript
class LogAspect implements Aspect {
    execute(ctx: AspectContext): void {
        console.log(ctx);
    }
};
```
Also, we create the following `Calculator` class: 
```typescript
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }

    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Division by zero!');
        }

        return a / b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }
};
```
Now the `LogAspect` can be injected to an instance of `Calculator`. In the following example, the aspect is supposed to be executed **before** running the actual business logic: 
```typescript
const calculator = new Calculator();
addAspectToPointcut(calculator, '.*', Advice.Before, new LogAspect());
```

By defining the `pointcut` as `'.*'`, the `aspect` is executed when calling **any** of the functions of the respective `Calculator` instance. Therefore, a call to:
```typescript
calculator.add(1, 2);
```

Should output:
```javascript
{
  target: Calculator {},
  methodName: 'add',
  advice: Advice.Before,
  functionParams: { a: 1, b: 2 },
  params: null,
  returnValue: null,
  error: null
}
```

And further calls to other functions like 
```typescript
calculator.subtract(1, 2);
calculator.divide(1, 2);
calculator.multiply(1, 2);
```

Should result in the same output (except for the changing `methodName`).

### Exceptions
An aspect can also be applied in case an `exception` occurs in the target code:
```typescript
const calculator = new Calculator();
addAspect(calculator, 'divide', Advice.TryCatch, new LogAspect());
calculator.divide(1, 0);
```

In this case, the `divide` function throws the `division by zero exception`. Due to `Advice.TryCatch` the error is being caught and control is handed over to the aspect, which logs the error as well as both input parameters of the divide function call.
> Because the aspect does not **rethrow** the exception implicitly, the handling will stop here. Rethrowing the error in the aspect is necessary if it is supposed to be handled elsewhere. 

## Example with Decorator
In addition, aspects can be added to a all class instances in a declarative manner by using the decorator `UseAspect`. Based on the Calculator example above, lets add another LogAspect to the `add` method so that the result gets logged to the console as well: 
```typescript
class Calculator {
    @UseAspect(Advice.AfterReturn, LogAspect)
    add(a: number, b: number) {
        return a + b;
    }
    // ...
}

const calculator = new Calculator();
calculator.add(1300, 37);
```

The aspect passed to the decorator can be either a class which provides a constructor with no arguments or an instance of an aspect.

### Parameters
You can pass additional parameters when using an aspect.
```typescript
class ServiceExample {
    @UseAspect(
        Advice.AfterReturn,
        CheckNullReturnAspect,
        { exception: new MyException() }
    )
    public getSomething() {
        return null;
    }
    // ...
}
```

So in Aspect you can recover this parameter.

```javascript
class CheckNullReturnAspect implements Aspect {
    execute(ctx: AspectContext): any {
        const exception = ctx.params.exception;
        const value = ctx.returnValue;

        if (!value) {
            throw exception;
        }
    }
} 
```

## Aspect with Before Advice
You can update the value of parameters passed in the injected function.

```javascript
class ServiceExample {
    getRequest(route: string) {
        //...
    }
}
```

In this example we can handle the parameter `(route: string)` and return it with the updated value.

```javascript
export class RouteProcessingAspect implements Aspect {

    execute(ctx: AspectContext): any {
        const route: string = ctx.functionParams.route;
        return [route.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')];
    }
}
```
In the `getRequest` method, the `route` parameter will be handled before the method call, without the need for the `getRequest` method itself to do so.

## Original Creator
| [<div><img width=115 src="https://avatars.githubusercontent.com/u/26504678?v=4"><br><sub>Michael Engel</sub></div>][engelmi] <div title="Code">💻</div> |
| :---: |

## Contributors
| [<div><img width=115 src="https://avatars.githubusercontent.com/u/54884313?v=4"><br><sub>Alexandre Ferreira de Lima</sub></div>][arekushi] <div title="Code">💻</div> |
| :---: |

<!-- [Constributors] -->
[arekushi]: https://github.com/Arekushi
[engelmi]: https://github.com/engelmi

<!-- [Some links] -->
[source_repo]: https://github.com/engelmi/ts-aspect
