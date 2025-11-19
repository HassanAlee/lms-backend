import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
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
  @IsMongoId()
  createdBy: Types.ObjectId | string;

  @IsNotEmpty()
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsNotEmpty()
  @IsEnum(CourseLevel)
  level: CourseLevel;
}
