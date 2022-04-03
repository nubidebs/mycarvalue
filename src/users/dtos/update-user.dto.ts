import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  id: number;
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
