import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  lockReconnect = false;  //避免ws重复连接
  wsUrl;

  // 客户端的服务 
  ws: WebSocket;
  constructor() { }
  // 定义返回一个流，这个流包含了服务器返回的消息 
  creatObservableSocket(url: string): Observable<any> {
    this.wsUrl = url;
    this.ws = new WebSocket(url);
    //连接服务器
    return new Observable(observer => {
      // 发送下一个元素 
      this.ws.onmessage = (event) => {
        observer.next(event.data);
        this.reset();
        this.start();
      };
      // 抛出异常
      this.ws.onerror = (event) => { observer.error(event); this.reconnect(this.wsUrl); };
      // 流结束 
      this.ws.onclose = (event) => observer.complete();
      this.ws.onopen = (event) => {
        // this.heartCheck.reset().start();      //心跳检测重置
        this.reset();
        this.start();
        // this.sendMessage("ping");
        console.log("连接成功!" + new Date().toUTCString());
      };
    })
  }
  // 向服务器发送一个消息 
  sendMessage(message: string) {
    this.ws.send(message);
  }
  reconnect(url) {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
      this.creatObservableSocket(url);
      this.lockReconnect = false;
    }, 2000);
  }


  //timeout: 540000,        //9分钟发一次心跳
  timeout: 3600;       //1分钟发一次心跳
  // timeout: 10800,        //3分钟发一次心跳
  timeoutObj: any;
  serverTimeoutObj: any;
  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
  }
  start() {
    debugger
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.sendMessage("ping");
      console.log("ping!")
      this.serverTimeoutObj = setTimeout(function () {
        //如果超过一定时间还没重置，说明后端主动断开了
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.ws.close();
      }, this.timeout)
    }, this.timeout)
  }
}
