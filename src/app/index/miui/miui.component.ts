import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-miui',
  templateUrl: './miui.component.html',
  styleUrls: ['./miui.component.css']
})
export class MiuiComponent implements OnInit {
  data: any;
  current = 1;
  size = 10;
  items: any;
  pages: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.http.get('http://192.168.81.129:17080/invoke/miuis/' + this.current + '/' + this.size).subscribe(data => {
      this.items = data['list'];
      this.data = data;
      this.pages = data['pages'];
    })
  }
  go() {
    this.loadData();
  }
  refresh() {
    debugger
    this.loadData();
  }
}
