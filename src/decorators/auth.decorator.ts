import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/entities';

export const Public = () => SetMetadata('isPublic', true);
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
