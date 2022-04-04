import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  // Called in the controller
  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // Hash user pw
    // 1. Generate salt (16 char long string). toString('hex') returns a Buffer
    const salt = randomBytes(8).toString('hex');
    // 2. Hash salt and pw together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 3. Join the hashed result  and salt together
    const result = salt + '.' + hash.toString('hex');
    // Create new user and save it
    const user = await this.userService.create(email, result);
    // return user
    return user;
  }

  signin() {}
}
