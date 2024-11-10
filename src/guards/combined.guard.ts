import { Injectable } from '@nestjs/common';
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, RolesGuard } from '.';

@Injectable()
export class CombinedGuard implements CanActivate {
    constructor(
        private readonly authGuard: AuthGuard,
        private readonly rolesGuard: RolesGuard,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await this.authGuard.canActivate(context);
        if (!isAuthenticated) return false;

        const hasRoles = await this.rolesGuard.canActivate(context);
        return hasRoles;
    }
}
