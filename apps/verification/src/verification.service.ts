import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
  getHello(): string {
    return 'Hello World!';
  }
}
