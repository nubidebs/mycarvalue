import { Test, TestingModule } from '@nestjs/testing';
import { SingleEntryPlugin } from 'webpack';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { makeUpdateUserDto } from './__fixtures__/make-update-user-dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ModuleRef } from '@nestjs/core';
import { makeCreateUserDto } from './__fixtures__/make-create-usert-dto';
import { NotFoundException } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type UserRepository = typeof TypeOrmModule.forFeature;

describe('UsersController', () => {
  // TESTS IN THE COURSE
  // let controller: UsersController;
  // let fakeUsersService: Partial<UsersService>;
  // let fakeAuthService: Partial<AuthService>;

  // beforeEach(async () => {
  // fakeUsersService = {
  //   findOne: (id: number) => {
  //     return Promise.resolve({
  //       id,
  //       email: 'asdf@asdf.com',
  //       password: 'asdf',
  //     } as User);
  //   },
  //   find: (email: string) => {
  //     return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
  //   },
  //   // remove: () => {},
  //   // update: () => {},
  // };

  // fakeAuthService = {
  //   signup: () => Promise.resolve(user),
  //   signin: () => Promise.resolve(user),
  // };
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UsersController],
  //     providers: [
  //       {
  //         provide: UsersService,
  //         useValue: fakeUsersService,
  //       },
  //       {
  //         provide: AuthService,
  //         useValue: fakeAuthService,
  //       },
  //     ],
  //   }).compile();

  //   controller = module.get<UsersController>(UsersController);
  // });

  // MY TESTS
  let controller: UsersController;
  let usersService: DeepMockProxy<UsersService>;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockDeep<UsersService>(),
        },
        {
          provide: AuthService,
          useValue: mockDeep<AuthService>(),
        },
      ],
    }).compile();

    controller = moduleRef.get(UsersController);
    usersService = moduleRef.get(UsersService);
    authService = moduleRef.get(AuthService);
  });

  let user = makeUpdateUserDto();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns users matching the given email when FindAll is called ', async () => {
    jest.spyOn(usersService, 'find').mockResolvedValue([user]);

    const users = await controller.findAllUsers('email@email.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('email@email.com');
  });

  it('returns a user when findUser is called', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    const userFound = await controller.findUser('2');
    expect(userFound).toMatchObject(user);
  });
  it('throws an error when the user is not found ', async () => {
    await expect(controller.findUser('3')).rejects.toThrowError(
      NotFoundException,
    );
  });

  describe('#signup', () => {
    it('create user and session', async () => {
      const signupSpy = jest
        .spyOn(authService, 'signup')
        .mockResolvedValue(user);

      const session = {};
      await controller.createUser(
        {
          email: 'email@email.com',
          password: 'pw',
        },
        session,
      );

      expect(session).toHaveProperty('userId', 2);

      expect(signupSpy).toBeCalledTimes(1);
      expect(signupSpy).toBeCalledWith('email@email.com', 'pw');
    });
  });
});
