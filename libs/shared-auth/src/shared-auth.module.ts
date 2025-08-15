import { Module } from '@nestjs/common';
import { SharedAuthService } from './shared-auth.service';

@Module({
  providers: [SharedAuthService],
  exports: [SharedAuthService],
})
export class SharedAuthModule {}
