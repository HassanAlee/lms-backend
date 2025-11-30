import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './rating.schema';
import { RatingService } from './rating.service';
import { CourseModule } from 'src/course/course.module';

@Module({
  controllers: [RatingController],
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    CourseModule,
  ],
  providers: [RatingService],
})
export class RatingModule {}
