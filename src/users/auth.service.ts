import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 1) see if the email already exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }

    // 2) hash password
    // 2.1) Generate a salt
    const salt = randomBytes(8).toString('hex');
    // 2.2) hash salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 2.3) join the hashed password and hash salt together
    const result = salt + '.' + hash.toString('hex');

    // 3) create a new user and save it
    const user = await this.usersService.create(email, result);

    // 4) return the new user
    return user;
  }

  async signin(email: string, password: string) {
    // 1) see if the email already exists
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    // 2) check if the password is correct
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    // 3) return the user
    return user;
  }
}
