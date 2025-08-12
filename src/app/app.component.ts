import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './shared/components/loading/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
      if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
  }
}