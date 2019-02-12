export class Message {
  constructor(
    public type: number,
    public sender: string,
    public content: any,
    public isBroadcast = false,
    public id?: string,
    public contentType?: string
  ) { }
}