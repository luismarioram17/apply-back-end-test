import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;
}
