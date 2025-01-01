import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { gameReducer } from './app/store/actions/game.reducer';  // Adjust path to your reducer
import { GameEffects } from './app/store/actions/game.effects';  // Adjust path to your effects
import 'zone.js'; // Ensure Zone.js is imported
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      StoreModule.forRoot({ game: gameReducer }),  // Configure your root store
      EffectsModule.forRoot([GameEffects]),  // Include the effects
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
      HttpClientModule,
      
    ),
    ...appConfig.providers
  ]
}).catch((err) => console.error(err));
