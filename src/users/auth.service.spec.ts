import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('#AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    usersServiceMock = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Create fake DI Container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    // Copy of AuthService class
    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('#Signup', () => {
    it('creates a new user with salted and hashed password', async () => {
      const user = await service.signup('test@test.com', 'testPassword');

      expect(user.password).not.toEqual('testPassword');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
    it('throws an error if email already exists ', async () => {
      await service.signup('test@test.com', 'testPassword');

      await expect(
        service.signup('test@test.com', 'testPassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('#Signin', () => {
    it('throws an error if signin is called with an unused email', async () => {
      await expect(
        service.signin('test@test.com', 'testPassword'),
      ).rejects.toThrow(NotFoundException);
    });
  });
  it('throws an error if password is invalid', async () => {
    await service.signup('test@test.com', 'testPassword');

    await expect(
      service.signin('test@test.com', 'wrongPassord'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('returns the user when successfully login', async () => {
    await service.signup('test@test.com', 'testPassword');

    const user = await service.signin('test@test.com', 'testPassword');
    expect(user).toBeDefined();
  });
});
