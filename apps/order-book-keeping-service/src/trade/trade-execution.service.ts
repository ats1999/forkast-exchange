import { Injectable, Logger } from '@nestjs/common';
import { Trade } from '@app/types/exchange/trade';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '@app/types/order/order';

@Injectable()
export class TradeExecutionService {
  private readonly logger = new Logger(TradeExecutionService.name);
  private readonly EXECUTION_BATCH_SIZE = 500;

  constructor(private readonly prismaService: PrismaService) {}

  async performTradeExecution(trades: Trade[]) {
    this.logger.log(`Performing trades: ${trades.length} trades total`);
    if (trades.length === 0) return;

    const MAX_RETRIES = 3;

    for (let i = 0; i < trades.length; i += this.EXECUTION_BATCH_SIZE) {
      const batch = trades.slice(i, i + this.EXECUTION_BATCH_SIZE);
      const batchNumber = i / this.EXECUTION_BATCH_SIZE + 1;

      this.logger.log(
        `Processing batch ${batchNumber} with ${batch.length} trades`,
      );

      let attempt = 0;
      let success = false;

      while (!success && attempt < MAX_RETRIES) {
        try {
          attempt++;
          await this.executeTradeBatch(batch);
          success = true;
          this.logger.log(
            `Batch ${batchNumber} executed successfully on attempt ${attempt}`,
          );
        } catch (err) {
          this.logger.error(
            `Error executing batch ${batchNumber} on attempt ${attempt}: ${err}`,
          );

          if (attempt < MAX_RETRIES) {
            const backoff = 100 * 2 ** attempt; // exponential backoff in ms
            this.logger.log(
              `Retrying batch ${batchNumber} after ${backoff}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, backoff));
          } else {
            // TODO: add centralized error logging and monitoring
            this.logger.error(
              `Failed to execute batch ${batchNumber} after ${MAX_RETRIES} attempts`,
            );
            throw err; // bubble up error after max retries
          }
        }
      }
    }
  }

  private async executeTradeBatch(trades: Trade[]) {
    try {
      await this.prismaService.$transaction(
        async (tx) => {
          await this.createTrades(tx, trades);

          const buyOrdersMap = new Map<string, number>();
          trades.forEach((t) => {
            buyOrdersMap.set(
              t.buyOrderId,
              (buyOrdersMap.get(t.buyOrderId) || 0) + t.quantity,
            );
          });
          await this.updateOrders(tx, buyOrdersMap);

          const sellOrdersMap = new Map<string, number>();
          trades.forEach((t) => {
            sellOrdersMap.set(
              t.sellOrderId,
              (sellOrdersMap.get(t.sellOrderId) || 0) + t.quantity,
            );
          });

          await this.updateOrders(tx, sellOrdersMap);
        },
        {
          isolationLevel: 'RepeatableRead',
        },
      );

      this.logger.log(`Executed batch of ${trades.length} trades successfully`);
    } catch (error) {
      this.logger.error(`Failed to execute trade batch`, error);
      throw error;
    }
  }

  private async updateOrders(
    tx: Prisma.TransactionClient,
    ordersMap: Map<string, number>,
  ) {
    for (const [orderId, quantity] of ordersMap.entries()) {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          filledQuantity: { increment: quantity },
        },
      });

      const newStatus: OrderStatus =
        updatedOrder.filledQuantity >= updatedOrder.quantity
          ? 'FILLED'
          : 'PARTIALLY_FILLED';

      if (updatedOrder.status !== newStatus) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });
      }
    }
  }

  private async createTrades(tx: Prisma.TransactionClient, trades: Trade[]) {
    return tx.trade.createMany({
      data: trades.map((trade) => ({
        tradeId: trade.tradeId,
        symbolId: trade.symbolId,
        price: trade.price,
        quantity: trade.quantity,
        buyOrderId: trade.buyOrderId,
        sellOrderId: trade.sellOrderId,
        timestamp: new Date(trade.timestamp),
      })),
    });
  }
}
