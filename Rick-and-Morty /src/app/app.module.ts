import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CardCharacterComponent } from './Components/card-character/card-character.component';
import { DetailsComponent } from './Pages/details/details.component';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import { CharactersComponent } from './Pages/characters/characters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './Components/select/select.component';


@NgModule({
  declarations: [
    AppComponent,
    CardCharacterComponent,
    DetailsComponent,
    CharactersComponent,
    SelectComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
