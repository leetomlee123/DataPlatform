import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  private datas: Observable<Object>;
  constructor(private http: HttpClient) { }
  author: string[] = [];
  authorX: number[] = [];
  authorOptions: any;
  phoneType: string[] = [];
  phoneTypeOptions: any;
  phoneTypeX: number[] = [];
  xx: any[]=[];
  yy: any[]=[];
  options: any;
  ngOnInit() {
    // let local = "http://127.0.0.1:8880/miuis";
    let local = "http://127.0.0.1:8181/miuis";

    let remote = "http://193.112.113.194:17080/invoke/miuis/top";

    this.http.get('http://193.112.113.194:8880/movies/chart').subscribe(data => {
      for (const key in data) {
        this.xx.push(data[key]['title']);
        this.yy.push(data[key]['rate']);

        this.options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: '电影评分排行榜',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.xx
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.yy,
            type: 'bar'
          }]
        }
      }
    });
    this.http.get(remote).subscribe(data => {
      data[0].forEach(element => {
        this.authorX.push(Number(element['value1']));
        this.author.push(element['category']);
        this.authorOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: '发表文章最多',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.author
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.authorX,
            type: 'bar'
          }]
        };
      });
      data[1].forEach(element => {
        this.phoneTypeX.push(Number(element['value1']));
        this.phoneType.push(element['category']);
        this.phoneTypeOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: '最热手机类型',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.phoneType
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.phoneTypeX,
            type: 'bar'
          }]
        };
      });
    });
  }
}
