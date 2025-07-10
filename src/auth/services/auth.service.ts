import { AccessTokenDto } from '@auth/controllers/dtos/access-token.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDoc } from '@users/docs';
import { UsersService } from '@users/services';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUser(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //check password using bcrypt
    const isPasswordValid = await compare(password, user.password);

    if (isPasswordValid) {
      const { password: _password, ...result } = user;

      return result;
    }

    return null;
  }

  login(user: UserDoc): AccessTokenDto {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
