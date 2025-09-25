

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RevealComponent } from './reveal.component';
import { HomeComponent } from './home.component';
import { CountOnMeComponent } from './count-on-me/count-on-me.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reveal', component: RevealComponent },
  {path: 'countonme', component: CountOnMeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    RevealComponent,
    HomeComponent,
    CountOnMeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
