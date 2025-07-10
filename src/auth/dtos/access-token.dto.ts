import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;
}
