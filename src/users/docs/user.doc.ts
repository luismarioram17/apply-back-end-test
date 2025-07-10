import { ApiProperty } from '@nestjs/swagger';

export class UserDoc {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
