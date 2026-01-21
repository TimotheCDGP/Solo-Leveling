import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateStepDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;
}