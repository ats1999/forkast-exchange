import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [AuthService, BasicStrategy],
  exports: [AuthService, BasicStrategy],
})
export class AuthModule {}
