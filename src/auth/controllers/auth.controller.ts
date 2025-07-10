import { RequestUser } from '@auth/decorators';
import { LoginDto } from '@auth/dtos';
import { UseLocalAuth } from '@auth/guards/local-auth.guard';
import { AuthService } from '@auth/services';
import { Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDoc } from '@users/docs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: UserDoc,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @UseLocalAuth()
  signIn(@RequestUser() user: UserDoc) {
    return this.authService.login(user);
  }
}
