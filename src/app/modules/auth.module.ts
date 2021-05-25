import {Global, Module} from '@nestjs/common';
import AuthenticationGuard from '../guards/authentication.guard';
import AuthService from '../services/auth.service';

@Global()
@Module({
  imports: [AuthenticationGuard, AuthService],
  providers: [AuthService],
  exports: [AuthService, AuthenticationGuard],
})
export default class AuthModule {
}
