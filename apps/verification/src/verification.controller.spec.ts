import { Test, TestingModule } from '@nestjs/testing';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

describe('VerificationController', () => {
  let verificationController: VerificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers: [VerificationService],
    }).compile();

    verificationController = app.get<VerificationController>(VerificationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(verificationController.getHello()).toBe('Hello World!');
    });
  });
});
