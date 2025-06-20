import { Test, TestingModule } from '@nestjs/testing';
import { GambarService } from './gambar.service';

describe('GambarService', () => {
  let service: GambarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GambarService],
    }).compile();

    service = module.get<GambarService>(GambarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
