import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dtos/create-course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}
  public async create(createCourseDto: CreateCourseDto) {
    try {
      const course = await this.courseModel.create(createCourseDto);
      return {
        success: true,
        message: 'Course created successfully',
        data: course,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || 'Failed to create course',
          data: null,
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to create course',
        data: null,
      };
    }
  }
}
