import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AuthUser } from './auth.types';

const JWT_ALGORITHM = 'HS256';
const JWT_TTL_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class JwtService {
  signJwt(user: AuthUser) {
    const header = this.encode({ alg: JWT_ALGORITHM, typ: 'JWT' });
    const payload = this.encode({
      ...user,
      exp: Math.floor(Date.now() / 1000) + JWT_TTL_SECONDS,
    });
    const body = `${header}.${payload}`;

    return `${body}.${this.sign(body)}`;
  }

  verifyJwt(token: string): AuthUser {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);
    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);

    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as AuthUser & { exp: number };

    if (
      !payload.id ||
      !payload.username ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    return { id: payload.id, username: payload.username };
  }

  private encode(value: object) {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private sign(value: string) {
    return createHmac('sha256', this.jwtSecret())
      .update(value)
      .digest('base64url');
  }

  private jwtSecret() {
    return process.env.JWT_SECRET ?? 'development-jwt-secret-change-me';
  }
}
