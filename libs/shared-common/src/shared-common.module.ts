import { Module } from '@nestjs/common';
import { SharedCommonService } from './shared-common.service';

@Module({
  providers: [SharedCommonService],
  exports: [SharedCommonService],
})
export class SharedCommonModule {}
