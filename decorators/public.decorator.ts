import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'constants/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
