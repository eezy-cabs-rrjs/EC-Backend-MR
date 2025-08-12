import { Injectable } from '@nestjs/common';

@Injectable()
export class DriversService {
  getHello(): string {
    return 'Hello World!';
  }
}
