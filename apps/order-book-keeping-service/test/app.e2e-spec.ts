import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OrderBookKeepingServiceModule } from './../src/order-book-keeping-service.module';

describe('OrderBookKeepingServiceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderBookKeepingServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
