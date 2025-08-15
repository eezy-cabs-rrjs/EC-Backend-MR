import { Test, TestingModule } from '@nestjs/testing';
import { SharedAuthService } from './shared-auth.service';

describe('SharedAuthService', () => {
  let service: SharedAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedAuthService],
    }).compile();

    service = module.get<SharedAuthService>(SharedAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
