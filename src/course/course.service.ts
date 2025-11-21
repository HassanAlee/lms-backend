import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dtos/create-course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}
  public async create(createCourseDto: CreateCourseDto) {
    try {
      // todo: get course image as file and save to cloudinary
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

  public async findAll() {
    try {
      const courses = await this.courseModel
        .find({ status: 'draft' })
        .populate({
          path: 'createdBy',
          select: 'firstName lastName _id',
        });

      return {
        success: true,
        message: 'Courses fetched successfully',
        data: courses,
      };
    } catch (error) {
      throw new HttpException(
        error.message ?? 'Some went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
