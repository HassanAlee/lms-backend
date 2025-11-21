import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseLevel, CourseStatus } from 'constants/course-level.enum';
import { Types } from 'mongoose';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  price: string;

  @IsOptional()
  @IsMongoId()
  createdBy: Types.ObjectId | string;

  @IsNotEmpty()
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsNotEmpty()
  @IsEnum(CourseLevel)
  level: CourseLevel;
}
