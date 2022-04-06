import { UpdateUserDto } from '../dtos/update-user.dto';

export const makeUpdateUserDto = (override: Partial<UpdateUserDto> = {}) => {
  return {
    id: 2,
    email: 'email@email.com',
    password: 'Password1!',
    ...override,
  };
};
