import { SetMetadata } from '@nestjs/common';
import { PermissionScopes } from '../../feature/user/entity/permission.entity';

export const Scopes = (...scopes: PermissionScopes[]) => SetMetadata('scopes', scopes);
