import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class RatingDto {
  @IsNotEmpty()
  @IsMongoId()
  course_id: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  comment: string;
}
