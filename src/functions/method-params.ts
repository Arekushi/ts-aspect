import { IndexedKeyValuePair } from '@interfaces/key-value.interface';

export const extractParameters = (method: any): IndexedKeyValuePair => {
    const methodString = method.toString();
    const parameterRegex = /\(([^)]*)\)/;
    const matchResult = parameterRegex.exec(methodString);

    if (!matchResult || !matchResult[1]) {
        return {};
    }

    const parameters = matchResult[1].split(',');
    const parameterNamesWithDefaults: IndexedKeyValuePair = {};

    parameters.forEach((parameter, index) => {
        const [name, defaultValue] = parameter.trim().split('=');
        parameterNamesWithDefaults[name.trim()] = {
            index,
            value: defaultValue ? JSON.parse(defaultValue.trim()) : undefined,
        };
    });

    return parameterNamesWithDefaults;
};

export const mergeWithArgs = (
    paramsNames: IndexedKeyValuePair,
    args: any[],
): IndexedKeyValuePair => {
    Object.keys(paramsNames).forEach((key, index) => {
        if (args[index] !== undefined) {
            paramsNames[key].value = args[index];
        }
    });

    return paramsNames;
};

export const mergeTwoPair = (
    source: IndexedKeyValuePair,
    update: IndexedKeyValuePair
): IndexedKeyValuePair => {
    if (!source) {
        return update;
    }

    if (!update) {
        return source;
    }

    return Object.assign({}, source, update);
};

export const convertToArray = (
    parameters: IndexedKeyValuePair,
): any[] => {
    return Object.values(parameters)
        .map(x => x.value)
        .sort((a, b) => a.index - b.index);
};
