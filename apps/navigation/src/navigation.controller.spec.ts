import { Test, TestingModule } from '@nestjs/testing';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

describe('NavigationController', () => {
  let navigationController: NavigationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NavigationController],
      providers: [NavigationService],
    }).compile();

    navigationController = app.get<NavigationController>(NavigationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(navigationController.getHello()).toBe('Hello World!');
    });
  });
});
