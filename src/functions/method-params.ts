export const getParameterNames = (method: any): string[] => {
    const parameterRegex = /\(([^)]*)\)/;
    const matchResult = parameterRegex.exec(method.toString());

    if (matchResult) {
        return matchResult[0]
            .replace(/[()]/g, '')
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s !== '');
    }

    return [];
};

export const convertToObj = (paramsNames: string[], args: any[]): any => {
    return Object.fromEntries(paramsNames.map((name, index) => [name, args[index]]));
};
