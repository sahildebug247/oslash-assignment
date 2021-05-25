import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { oc } from 'ts-optchain';
import UserEntity from '../../db/entities/user.entity';
import ReturnVal from '../../lib/ReturnVal';
import Logger from '../../lib/Logger';
import AuthService from '../services/auth.service';

const logger = new Logger('AuthenticationGuard');
@Injectable()
class AuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = await oc<any>(request).headers.authorization();

    const user: UserEntity = await this.validateJWTToken(jwtToken);
    if (user) {
      logger.debug('Attach User Guard Called');
      request.user = user;
      return true;
    } else {
      return false;
    }
  }

  public async validateJWTToken(token: string): Promise<UserEntity> {
    const vr: ReturnVal = await this.authService.validateJWTToken(token);
    if (vr.success) return vr.data;
    else throw new UnauthorizedException(vr.message);
  }
}

export default AuthenticationGuard;
