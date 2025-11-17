import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'constants/user-role.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({ required: false, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop()
  profilePicture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
