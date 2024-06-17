export class SampleClassAsync {

    constructor(
        public sampleId: number
    ) {
        this.sampleId = sampleId;
    }

    async getSampleIdAsync(): Promise<number> {
        return this.sampleId;
    }
}
