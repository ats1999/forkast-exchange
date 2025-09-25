import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookKeepingServiceController } from './order-book-keeping-service.controller';
import { OrderBookKeepingServiceService } from './order-book-keeping-service.service';

describe('OrderBookKeepingServiceController', () => {
  let orderBookKeepingServiceController: OrderBookKeepingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderBookKeepingServiceController],
      providers: [OrderBookKeepingServiceService],
    }).compile();

    orderBookKeepingServiceController = app.get<OrderBookKeepingServiceController>(OrderBookKeepingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderBookKeepingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
