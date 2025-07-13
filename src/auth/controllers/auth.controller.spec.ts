import { AuthController } from '@auth/controllers';
import { AuthService } from '@auth/services';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDoc } from '@users/docs';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.login with the user', () => {
      const user: UserDoc = {
        id: 1,
        username: 'testuser',
        email: 'testuser@email.com',
      };
      jest
        .spyOn(mockAuthService, 'login')
        .mockReturnValueOnce({ access_token: 'fake-token' });

      const result = controller.signIn(user);

      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'fake-token' });
    });
  });
});
