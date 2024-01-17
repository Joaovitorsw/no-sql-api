import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorDomainService } from 'src/services/error-domain/error-domain.service';
import { IS_PUBLIC_KEY } from '../decorators/is-public-route';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly errorDomainService: ErrorDomainService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    try {
      const canActivate = super.canActivate(context);
      if (typeof canActivate === 'boolean') {
        return canActivate;
      }

      const canActivatePromise = canActivate as Promise<boolean>;
      return canActivatePromise;
    } catch (error) {
      this.errorDomainService.addError({
        type: 'UnauthorizedError',
        message: 'Você não tem permissão para acessar esse recurso',
      });
      this.errorDomainService.statusCode = HttpStatus.UNAUTHORIZED;
    }
  }
}
