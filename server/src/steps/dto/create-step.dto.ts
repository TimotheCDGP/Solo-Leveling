import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateStepDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre de l\'étape est obligatoire' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}