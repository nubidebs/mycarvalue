import { CreateUserDto } from '../dtos/create-user.dto';

export const makeCreateUserDto = (override: Partial<CreateUserDto> = {}) => {
  return {
    email: 'test@falsepill.com',
    password: 'Password1!',
    ...override,
  };
};
