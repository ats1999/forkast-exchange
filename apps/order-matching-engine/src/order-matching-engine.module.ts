import { Module } from '@nestjs/common';
import { OrderMatchingEngineController } from './order-matching-engine.controller';
import { OrderMatchingEngineService } from './order-matching-engine.service';

@Module({
  imports: [],
  controllers: [OrderMatchingEngineController],
  providers: [OrderMatchingEngineService],
})
export class OrderMatchingEngineModule {}
