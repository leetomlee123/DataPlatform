import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Message } from '../../model/Message';
import { UserInfo } from '../../model/UserInfo';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { webSocket } from 'rxjs/webSocket'
const url = "ws://193.112.113.194:9898/chat";
// const url = 'ws://192.168.137.1:9898/chat';
// const url = 'ws://127.0.0.1:17080/im/chat';
// const url = 'ws://192.168.10.86:17080/im/chat';
// const url = 'ws://192.168.10.86:9898/im/chat';

@Component({
  selector: 'app-materialchat',
  templateUrl: './materialchat.component.html',
  styleUrls: ['./materialchat.component.scss']
})
export class MaterialchatComponent implements AfterViewInit {
  @ViewChild('viewer') private viewer: ElementRef;
  public infos = new Map<string, Array<Message>>();
  public room: string;
  public serverMessages = new Array<Message>();
  public all = new Array<Message>();
  public person = new Array<Message>();
  public users = new Array<UserInfo>();
  public clientMessage = '';
  public isBroadcast = true;
  public sender = localStorage.getItem('username').toString();
  public oto = false;
  public id: string;
  public reconnect = 0;
  public clocks = new Array<string>();
  public socket$: WebSocketSubject<Message>;
  public fileList: UploadFile[] = [];
  public sendImg = false;
  public baseImg = '';
  public interval: any;

  constructor(private msg: NzMessageService) {
    // this.socket$ = new WebSocketSubject(url);

    this.socket$ = webSocket(url);

    this.socket$
      .subscribe(
        (message) => {

          // console.log(this.socket$);

          // this.msg.error('与服务器连接');
          this.resolveMeeage(message);
        },
        (err) => {
          // console.log(this.socket$);

          // // this.socket$.unsubscribe();
          // this.interval = setInterval(() => {
          //   this.reconnectMethod();
          // }, 10000);
        },
        () => this.msg.success('连接服务器成功')
      );

    const message = new Message(1, this.sender, this.clientMessage, this.isBroadcast);
    this.socket$.next(message);
  }
  private reconnectMethod() {
    if (this.reconnect < 5) {
      // console.log("reconnect" + this.reconnect);
      this.reconnect++;
      this.msg.info('尝试重新连接服务器');
      this.socket$.subscribe(() => {

      });
      // console.log(this.socket$['_socket']);

      // if (this.socket$['_socket'] != null) {
      //   this.reconnect = 0;
      //   clearInterval(this.interval);
      // }
    }
    else {
      clearInterval(this.interval);
      this.msg.error('无法连接服务器');
    }
  }
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    this.sendImg = true;
    this.fileList.forEach((file: any) => {
      this.clientMessage = file.name;

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (result) {
        document.getElementById("x").setAttribute("src", result.target['result']);
      }
    });
    return false;
  }
  private resolveMeeage(message: Message) {

    // console.log(new Date().toTimeString() + message.content);
    if (message.type == 1) {
      this.all.push(message) && this.scroll();
      this.serverMessages = this.all;
    }
    else if (message.type == 4) {
      let infos = message.content;
      if (infos != null) {
        this.users.length = 0;
      }
      infos.forEach(element => {
        if (element.name != this.sender) {
          this.users.push(new UserInfo(element.id, element.name));
        }
      });
    }
    else if (message.type == 5) {
      this.clocks.push(message.sender);
      if (this.infos.has(message.sender)) {
        let info = this.infos.get(message.sender);
        info.push(message);
        this.infos.set(message.sender, info);
      }
      else {
        let info = new Array<Message>();
        info.push(message);
        this.infos.set(message.sender, info);
      }
      this.id = message.id;
    }
    else if (message.type == 6) {
      // console.log(message.content);
      this.socket$.next(message);
    }
  }



  asyncImgData(img: string): void {
    this.baseImg = img;

  }

  showInfo(name: string) {
    this.room = name;
    this.serverMessages = this.infos.get(name);
    this.clocks.splice(this.clocks.indexOf(name), 1);
    this.oto = true;

  }
  showClock(name: string): boolean {
    return this.clocks.includes(name) && !this.oto;
  }

  userInfo() {

  }
  onEnter() { this.send() }
  main(name: string) {
    if (name == 'common') {
      this.oto = false;
      this.serverMessages = this.all;
    } else {
      this.oto = true;
      this.serverMessages = this.infos.get(name);
    }

  }
  changeRoom(name: string) {
    // console.log(name);
  }

  sendTo(id: string, name: string) {
    this.oto = true;
    this.room = name;
    this.serverMessages = this.person;
    this.id = id;
    this.serverMessages = this.infos.get(name);

  }

  ngAfterViewInit(): void {
    // this.scroll();
  }

  private toggleIsBroadcast(): void {
    this.isBroadcast = !this.isBroadcast;
  }

  public send(): void {
    if (this.clientMessage == '' && !this.sendImg) {
      return;
    }
    let message: Message;
    if (this.sendImg) {
      this.baseImg = document.getElementById("x").getAttribute("src");
      document.getElementById("x").setAttribute("src", "");
      this.fileList.length = 0;
    }
    if (!this.oto) {
      if (this.sendImg) {

        message = new Message(1, this.sender, this.baseImg, this.isBroadcast, '', 'img');
        this.sendImg = false;
      } else {
        message = new Message(1, this.sender, this.clientMessage, this.isBroadcast);

      }
    } else {
      if (this.sendImg) {

        message = new Message(5, this.sender, this.baseImg, false, this.id, 'img');
        this.sendImg = false;
      } else {

        message = new Message(5, this.sender, this.clientMessage, false, this.id);
      }


      if (this.infos.has(this.room)) {
        let info = this.infos.get(this.room);
        info.push(message);
        this.infos.set(message.sender, info);
      } else {
        let info = new Array<Message>();
        info.push(message);
        this.infos.set(this.room, info);
      }
    }
    this.serverMessages = this.infos.get(this.room);
    // console.log(message);

    // this.serverMessages.push(message);


    this.socket$.next(message);
    this.clientMessage = '';
    this.scroll();
  }

  private isMine(message: Message): boolean {
    return message && message.sender === this.sender;
  }

  private getSenderInitials(sender: string): string {
    return sender && sender.substring(0, 2).toLocaleUpperCase();
  }

  private getSenderColor(sender: string, type): string {
    const alpha = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ';
    const initials = this.getSenderInitials(sender);
    const value = Math.ceil((alpha.indexOf(initials[0]) + alpha.indexOf(initials[1])) * 255 * 255 * 255 / 70);
    return '#' + value.toString(16).padEnd(6, '0');
  }

  private scroll(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private getDiff(): number {
    if (!this.viewer) {
      return -1;
    }

    const nativeElement = this.viewer.nativeElement;
    return nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight);
  }

  private scrollToBottom(t = 1, b = 0): void {
    if (b < 1) {
      b = this.getDiff();
    }
    if (b > 0 && t <= 120) {
      setTimeout(() => {
        const diff = this.easeInOutSin(t / 120) * this.getDiff();
        this.viewer.nativeElement.scrollTop += diff;
        this.scrollToBottom(++t, b);
      }, 1 / 60);
    }
  }

  private easeInOutSin(t): number {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }
}
