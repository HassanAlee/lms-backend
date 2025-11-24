import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseLevel, CourseStatus } from 'constants/course-level.enum';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Prop({ required: false, enum: CourseStatus, default: CourseStatus.PENDING })
  status: CourseStatus;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
