import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class EnrollCourseDto {
  @IsNotEmpty()
  @IsMongoId()
  user_id: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  course_id: Types.ObjectId;
}
