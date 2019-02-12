import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { WelcomeComponent } from './index/welcome/welcome.component';
import { MiuiComponent } from './index/miui/miui.component';
import { RegisterComponent } from './register/register.component';
import { MaterialchatComponent } from './index/materialchat/materialchat.component';
import { MusicComponent } from './index/music/music.component';
import { MovieComponent } from './index/movie/movie.component';
import { VideoComponent } from './index/video/video.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: '登陆' } },
  { path: 'register', component: RegisterComponent, data: { title: '注册', animation: 'register' } },
  {
    path: 'index', component: IndexComponent, data: { title: '首页' }, children: [
      { path: '', component: WelcomeComponent },
      { path: 'miui', component: MiuiComponent },
      { path: 'music', component: MusicComponent },
      { path: 'movie', component: MovieComponent },
      { path: 'video', component: VideoComponent },
      { path: 'chat', component: MaterialchatComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})

export class AppRoutingModule { }
