import { Test, TestingModule } from '@nestjs/testing';
import { SharedCommonService } from './shared-common.service';

describe('SharedCommonService', () => {
  let service: SharedCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedCommonService],
    }).compile();

    service = module.get<SharedCommonService>(SharedCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
