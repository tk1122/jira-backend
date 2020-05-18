import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {UserSession} from '../../../shared/interface/session.interface';
import {AuthService} from "../auth.service";
import {FatalError} from "tslint/lib/error";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const requiredScopes = this.reflector.get<string[]>('scopes', context.getHandler());

        // if no @Roles decorator applied then @RoleGuard can activate
        if (!requiredScopes || requiredScopes.length === 0) return true;

        const isPublic = this.reflector.get<string[]>('isPublic', context.getHandler());
        if (isPublic) {
            throw new FatalError('Scopes and Public decorator cannot exist in the same route handler')
        }

        // if no @AuthGuard is applied then @RoleGuard alone cant activate
        const request = context.switchToHttp().getRequest();
        if (!request.user) return false;

        const session: UserSession = request.user;

        const userScopes = (await this.authService.getPermissionsByUserId(session.userId))
            ?.roles
            .reduce((scopes: string[], role) => ([...scopes, ...role.permissions.map(p => p.scope)]), [])


        return requiredScopes.every(scope => userScopes?.includes(scope));
    }
}
