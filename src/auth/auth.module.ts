import { AuthController } from '@auth/controllers';
import { AuthService } from '@auth/services';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
