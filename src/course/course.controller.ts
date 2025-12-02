import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User } from 'decorators/user.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from 'constants/user-role.enum';
import { Public } from 'decorators/public.decorator';
import { EnrollCourseDto } from './dtos/enroll-course.dto';
import { Types } from 'mongoose';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  // create course
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Post()
  public create(
    @Body() createCourseDto: CreateCourseDto,
    @User() user: { sub: string },
  ) {
    return this.courseService.create({
      ...createCourseDto,
      createdBy: user.sub,
    });
  }

  // find all courses
  @Public()
  @Get()
  public findAll() {
    return this.courseService.findAll();
  }

  // find course by id
  @Public()
  @Get(':id')
  public findOne(@Param('id') courseId: Types.ObjectId) {
    return this.courseService.getCourseDetails(courseId);
  }
  // approve/reject course
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('update-course-status/:courseId')
  public updateCourseApprovalStatus(
    @Param() param: { courseId: string },
    @Query() query: { status: string },
  ) {
    return this.courseService.updateCourseApprovalStatus(
      param.courseId,
      query.status,
    );
  }

  // enroll in a course
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.STUDENT)
  @Post('enroll-course')
  public enrollCourse(@Body() enrollCourseDto: EnrollCourseDto) {
    return this.courseService.enrollCourse(enrollCourseDto);
  }

  // see courses enrolled
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @Get('enrolled-courses')
  public enrolledCourses(@User() user: { sub: string }) {
    return this.courseService.enrolledCourses({ userId: user.sub });
  }
}
