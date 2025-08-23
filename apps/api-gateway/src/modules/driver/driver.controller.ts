import { Controller } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
}
