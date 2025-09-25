import { Module } from '@nestjs/common';
import { OrderMatchingEngineController } from './order-matching-engine.controller';
import { OrderMatchingEngineService } from './order-matching-engine.service';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [EngineModule],
  controllers: [OrderMatchingEngineController],
  providers: [OrderMatchingEngineService],
})
export class OrderMatchingEngineModule {}
