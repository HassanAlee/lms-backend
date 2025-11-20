import { Body, Controller, Post } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User } from 'decorators/user.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
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
