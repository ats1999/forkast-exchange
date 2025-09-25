import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [],
  providers: [ExchangeService],
})
export class EngineModule {}
