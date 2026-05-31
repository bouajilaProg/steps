import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    const token = this.extractToken(authHeader);

    request.user = this.jwtService.verifyJwt(token);

    return true;
  }

  private extractToken(authHeader: string | string[] | undefined) {
    const value = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!value?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return value.slice('Bearer '.length).trim();
  }
}
