import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

describe('DriversController', () => {
  let driversController: DriversController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService],
    }).compile();

    driversController = app.get<DriversController>(DriversController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(driversController.getHello()).toBe('Hello World!');
    });
  });
});
