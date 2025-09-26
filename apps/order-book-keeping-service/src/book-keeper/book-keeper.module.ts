import { Module } from '@nestjs/common';
import { BookKeeperService } from './book-keeper.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [BookKeeperService],
  exports: [BookKeeperService],
})
export class BooKeeperModule {}
