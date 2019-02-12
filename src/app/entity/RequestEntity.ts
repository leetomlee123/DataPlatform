export class RequestEntity {
    public infoType: string;
    public dataLen: number;
    public data: string[];
    constructor(infoType: string, dataLen: number, data: string[]) {
        this.data = data;
        this.infoType = infoType;
        this.dataLen = dataLen;
    }


}