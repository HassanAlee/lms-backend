import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'constants/common';
import { UserRole } from 'constants/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
