import { Injectable } from '@nestjs/common';

@Injectable()
export class NavigationService {
  getHello(): string {
    return 'Hello World!';
  }
}
