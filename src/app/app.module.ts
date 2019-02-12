import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './/app-routing.module';
import { IndexComponent } from './index/index.component';
import { HttpinterceptorService } from './service/httpinterceptor.service';
import { MiuiComponent } from './index/miui/miui.component';
import { WelcomeComponent } from './index/welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaterialchatComponent } from './index/materialchat/materialchat.component';
import { MatButtonModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatListModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { MovieComponent } from './index/movie/movie.component';
import { MusicComponent } from './index/music/music.component';
import { VideoComponent } from './index/video/video.component';

registerLocaleData(zh);
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpinterceptorService, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    MiuiComponent,
    WelcomeComponent,
    RegisterComponent,
    MaterialchatComponent,
    MovieComponent,
    MusicComponent,
    VideoComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxEchartsModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatChipsModule,
    MatIconModule],
  bootstrap: [AppComponent],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, httpInterceptorProviders, { provide: LocationStrategy, useClass: HashLocationStrategy }]
}
)
export class AppModule {
}
