import { Routes } from '@angular/router';
import { DetailsComponent } from './Pages/details/details.component';
import { AppComponent } from './app.component';
import { CharactersComponent } from './Pages/characters/characters.component';

export const routes: Routes = [
  { path: '', component: CharactersComponent },
  { path: 'details/:id', component: DetailsComponent }
];
