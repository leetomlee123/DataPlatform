import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  public items = [];
  loading = false;
  hasMore = true;
  private index = 0;
  constructor(private http: HttpClient, private msg: NzMessageService) { }

  ngOnInit() {
    this.getData()
  }
  getData(): void {
    this.index = this.index + 1;
    this.http.get('http://192.168.81.129:17080/invoke/movies/init/' + this.index + '/12').subscribe(data => {
      this.items = this.items.concat(data['list']);
      this.loading = false;
      this.hasMore = data['hasNextPage'];
    });
    
  }
  onScroll(): void {
    if (this.loading) return;
    this.loading = true;
    if (!this.hasMore) {
      this.msg.warning('我是有底线的');
      this.hasMore = false;
      this.loading = false;
      return;
    }
    this.getData();
  }
}
