import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TimerService {
     private intervalId: any;

     startTimer(duration: number, callback: (remaining: number) => void) {
          this.clearTimer();
          let remaining = duration;
          this.intervalId = setInterval(() => {
               remaining--;
               callback(remaining);
               if (remaining <= 0) this.clearTimer();
          }, 1000);
     }

     clearTimer() {
          if (this.intervalId) {
               clearInterval(this.intervalId);
               this.intervalId = null;
          }
     }
}