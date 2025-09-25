import { Test, TestingModule } from '@nestjs/testing';
import { OrderMatchingEngineController } from './order-matching-engine.controller';
import { OrderMatchingEngineService } from './order-matching-engine.service';

describe('OrderMatchingEngineController', () => {
  let orderMatchingEngineController: OrderMatchingEngineController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderMatchingEngineController],
      providers: [OrderMatchingEngineService],
    }).compile();

    orderMatchingEngineController = app.get<OrderMatchingEngineController>(OrderMatchingEngineController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderMatchingEngineController.getHello()).toBe('Hello World!');
    });
  });
});
