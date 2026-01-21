import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsEnum,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Priority } from './priority.enum';
import { GoalStatus } from './goalstatus.enum';
import { Type } from 'class-transformer';

class GoalStepInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateGoalDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    deadline: string;

    @IsEnum(Priority)
    priority: Priority;

    @IsEnum(GoalStatus)
    @IsOptional()
    status?: GoalStatus;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GoalStepInput)
    steps?: GoalStepInput[];
}