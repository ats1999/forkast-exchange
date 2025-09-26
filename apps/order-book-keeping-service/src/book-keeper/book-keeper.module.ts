import { Module } from '@nestjs/common';
import { BookKeeperService } from './book-keeper.service';

@Module({
  imports: [],
  providers: [BookKeeperService],
})
export class BooKeeperModule {}
