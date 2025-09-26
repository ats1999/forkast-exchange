import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OrderMatchingEngineModule } from './../src/order-matching-engine.module';

describe('OrderMatchingEngineController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderMatchingEngineModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
