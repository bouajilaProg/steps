import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';

@Module({
  providers: [AuthService, JwtAuthGuard, JwtService],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtService],
})
export class AuthModule {}
