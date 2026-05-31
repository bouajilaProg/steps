import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Admin username' })
  username: string;

  @ApiProperty({ example: 'admin', description: 'Admin password' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: { id: 'uuid', username: 'admin' } })
  user: { id: string; username: string };

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}
