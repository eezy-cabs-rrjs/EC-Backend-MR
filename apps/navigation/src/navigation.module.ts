import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  imports: [],
  controllers: [NavigationController],
  providers: [NavigationService],
})
export class NavigationModule {}
