import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';

@Module({
  providers: [AuthService, JwtAuthGuard, JwtService],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtService],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) { }

  async onModuleInit() {
    await this.authService.seedAdmin();
  }
}
