import { Test, TestingModule } from '@nestjs/testing';
import { OrdersDetailsService } from './orders-details.service';

describe('OrdersDetailsService', () => {
  let service: OrdersDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersDetailsService],
    }).compile();

    service = module.get<OrdersDetailsService>(OrdersDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
