export interface IndexedKeyValuePair {
    [key: string]: {
        index: number;
        value?: any;
    };
}
