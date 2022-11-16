import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TERMS } from 'src/utils/constants';
import { UserTokenDTO } from 'src/utils/user.seed';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TokenAuthGuard implements CanActivate {
    constructor(private configService: ConfigService, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const ssoToken = request.headers['x-auth-token'] || '';
            if (ssoToken) {
                const decodedSsoToken: UserTokenDTO = await this.jwtService.verifyAsync(ssoToken, {
                    secret: this.configService.get('JWT_SECRET'),
                    ignoreExpiration: false
                }) as UserTokenDTO;
                const roleFromSso = decodedSsoToken?.roles;
                if (!roleFromSso || !roleFromSso.length || !roleFromSso.includes(TERMS.ROLE_SUPER_ADMIN)) {
                    throw new ForbiddenException(TERMS.FORBIDDEN_TEXT);
                }
                return true;
            } else {
                throw new UnauthorizedException(TERMS.UNAUTHORIZED_TEXT);
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }
    }
}
