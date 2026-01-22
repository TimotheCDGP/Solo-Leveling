import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password?: string;
}