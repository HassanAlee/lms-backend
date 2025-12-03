import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model, Types } from 'mongoose';
import { CreateCourseDto } from './dtos/create-course.dto';
import { EnrollCourseDto } from './dtos/enroll-course.dto';
import { Enrollment } from './enrollment.schema';
import { RatingService } from 'src/rating/rating.service';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
    @Inject(forwardRef(() => RatingService))
    private readonly ratingService: RatingService,
  ) {}
  // create course
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

  // find all courses
  public async findAll() {
    try {
      const courses = await this.courseModel
        .find({ status: 'approved' })
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

  // update course approval status
  public async updateCourseApprovalStatus(courseId: string, status: string) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Course id must be a valid mongodb id');
    }
    try {
      let course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      course = await this.courseModel.findByIdAndUpdate(courseId, { status });
      // todo: send an email to the instructor about course status update
      return {
        success: true,
        message: `Course ${status} successfully`,
        data: course,
      };
    } catch (error) {
      // If it's a known HTTP error, rethrow
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Otherwise handle unknown errors
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // enroll course
  public async enrollCourse(enrollCourseDto: EnrollCourseDto) {
    try {
      const alreadyEnrolled = await this.enrollmentModel.findOne({
        course_id: enrollCourseDto.course_id,
        user_id: enrollCourseDto.user_id,
      });
      if (alreadyEnrolled) {
        throw new BadRequestException('Cannot enroll course twice');
      }
      await this.enrollmentModel.create(enrollCourseDto);
      // todo: send welcome email to student
      return {
        success: true,
        message: 'Course enrolled successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // enrolled courses
  public async enrolledCourses({ userId }: { userId: string }) {
    try {
      const enrollments = await this.enrollmentModel
        .find({ user_id: userId })
        .populate({
          path: 'course_id',
          populate: {
            path: 'createdBy',
            model: 'User',
            select: 'firstName lastName _id profilePicture',
          },
        });

      const updated = enrollments.map((e) => ({
        course: e.course_id,
        _id: e._id,
      }));
      return {
        success: true,
        message: 'Courses fetched successfully',
        data: updated,
      };
    } catch {
      throw new InternalServerErrorException('Something wennt wrong');
    }
  }

  // get course by id
  public async getCourseById(course_id: Types.ObjectId) {
    if (!course_id) throw new BadRequestException('Course id must be provided');
    const course = await this.courseModel.findById(course_id);
    return course;
  }

  public async getCourseDetails(courseId: Types.ObjectId) {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new BadRequestException('course id must be a valid mongo id');
      }
      const course = await this.courseModel.findById(courseId).populate({
        path: 'createdBy',
        select: 'firstName lastName profilePicture',
      });
      const enrolments = await this.enrollmentModel.countDocuments({
        course_id: courseId,
      });
      const ratings = await this.ratingService.getRatingsByCourseId(courseId);
      return {
        success: true,
        message: 'Course details fetched successfully!',
        data: { course, enrolments, ratings },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message ?? 'Something went wrong',
      );
    }
  }

  // update course
  public async updateCourse(
    updateCourseDto: UpdateCourseDto,
    courseId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) throw new BadRequestException('Course not found');
      if (course.createdBy.toString() !== userId.toString()) {
        throw new UnauthorizedException(
          'You are not allowed to update this course',
        );
      }
      Object.assign(course, updateCourseDto);
      await course.save();

      return {
        success: true,
        message: 'Course updated',
        data: course,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error.message ?? 'Something went wrong',
      );
    }
  }
}
