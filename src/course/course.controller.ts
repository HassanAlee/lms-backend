import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User } from 'decorators/user.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from 'constants/user-role.enum';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
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
}
