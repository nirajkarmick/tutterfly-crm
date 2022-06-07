import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if(window){
    window.console.log=function(){};
    window.console.debug=function(){};
    window.console.error=function(){};
    window.alert=function(){};
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
