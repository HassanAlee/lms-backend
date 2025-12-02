import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './rating.schema';
import { Model, Types } from 'mongoose';
import { RatingDto } from './dtos/rating.dto';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModal: Model<Rating>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}
  public async rateCourse(ratingDto: RatingDto, userId: Types.ObjectId) {
    try {
      const isAlreadyRatted = await this.ratingModal.findOne({
        user_id: userId,
      });
      if (isAlreadyRatted)
        throw new BadRequestException("You can't rate a course twice.");
      const course = await this.courseService.getCourseById(
        ratingDto.course_id,
      );
      if (!course) throw new BadRequestException('Course not found');
      if (course.toObject().createdBy === userId) {
        throw new BadRequestException(
          'Instructor can not himself rate the course.',
        );
      }
      const rating = await this.ratingModal.create({
        ...ratingDto,
        user_id: userId,
      });
      return {
        success: true,
        message: 'Review added successfully',
        data: rating,
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
  public async getRatingsByCourseId(courseId: Types.ObjectId) {
    const ratings = await this.ratingModal
      .find({ course_id: courseId })
      .populate({
        path: 'user_id',
        select: 'firstName lastName profilePicture',
      })
      .lean();

    return ratings.map((r) => ({
      ...r,
      user: r.user_id,
      user_id: undefined,
    }));
  }
}
