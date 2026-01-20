import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsEnum,
} from 'class-validator';
import { Priority } from './priority.enum';
import { GoalStatus } from './goalstatus.enum';

export class CreateGoalDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    deadline: string;

    @IsEnum(Priority)
    priority: Priority;

    @IsEnum(GoalStatus)
    @IsOptional()
    status?: GoalStatus;
}