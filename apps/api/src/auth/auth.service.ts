import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq, loginSchema, schema, type Db } from '@steps/db';
import { DB_PROVIDER } from '../database/database.module';
import * as bcrypt from 'bcryptjs';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_PROVIDER) private db: Db,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    const credentials = result.data;

    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, credentials.username))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Wrong password');
    }

    const accessToken = this.jwtService.signJwt({
      id: user.id,
      username: user.username,
    });

    return {
      user: { id: user.id, username: user.username },
      accessToken,
    };
  }
}
