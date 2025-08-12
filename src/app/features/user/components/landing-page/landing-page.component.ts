import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';
import { HeaderComponent } from '@shared/components/partials/header/header.component';
import { SplashScreenComponent } from '@shared/components/splash-screen/splash-screen.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterModule,
    SplashScreenComponent,
    CommonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  showSplash = true;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      this.showSplash = false;
      return;
    }

    if (sessionStorage.getItem('splashShown')) {
      this.showSplash = false;
    } else {
      sessionStorage.setItem('splashShown','Done!');
      setTimeout(() => {
        document.querySelector('.splash-container')?.classList.add('fade-out');
        setTimeout(() => (this.showSplash = false), 500);
      }, 2000);
    }
  }
}
