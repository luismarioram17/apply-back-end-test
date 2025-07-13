import { JwtData } from '@auth/dtos/jwt-data.dto';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const mockConfigService = {
    get: jest.fn().mockResolvedValue('jwt_secret_mock'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: JwtStrategy,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            new JwtStrategy(configService),
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return jwt data', () => {
      const payload: JwtData = {
        sub: 1,
        username: 'testusername',
      };

      const result = jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        username: payload.username,
      });
    });
  });
});
