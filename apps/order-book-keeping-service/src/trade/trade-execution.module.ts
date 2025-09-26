import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { TradeExecutionService } from './trade-execution.service';

@Module({
  imports: [PrismaModule],
  providers: [TradeExecutionService],
  exports: [TradeExecutionService],
})
export class TradeExecutionModule {}
