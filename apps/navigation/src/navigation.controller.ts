import { Controller, Get } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller()
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  getHello(): string {
    return this.navigationService.getHello();
  }
}
