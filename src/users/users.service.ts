import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  /* repo: argument name.
    Type annotation of repo is Repository, we applied a generic type to it of User: which means that
    repos is going to be an instance of a TypeORM repository that deals with instances of users
    @InjectRepository: aid to the dep injection system that tells to inject the generic User 
    (used because we are using the generic type of User)*/

  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }
}