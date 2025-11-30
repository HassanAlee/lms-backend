import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from 'constants/user-role.enum';
import { RatingDto } from './dtos/rating.dto';
import { User } from 'decorators/user.decorator';
import { Types } from 'mongoose';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.STUDENT)
  @Post()
  public rateCourse(
    @Body() ratingDto: RatingDto,
    @User() user: { sub: Types.ObjectId },
  ) {
    return this.ratingService.rateCourse(ratingDto, user.sub);
  }
}
