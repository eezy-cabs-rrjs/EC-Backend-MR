import { Test, TestingModule } from '@nestjs/testing';
import { SharedPaymentService } from './shared-payment.service';

describe('SharedPaymentService', () => {
  let service: SharedPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedPaymentService],
    }).compile();

    service = module.get<SharedPaymentService>(SharedPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
