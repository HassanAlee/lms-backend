import {
  Body,
  Controller,
  Get,
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
}
