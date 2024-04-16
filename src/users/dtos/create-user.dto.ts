import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
// we need to import class validator package to validate email and password

// Dto will work inside controller
