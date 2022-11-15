import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TERMS } from 'src/utils/constants';
import { UserTokenDTO } from 'src/utils/user.seed';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TokenAuthGuard implements CanActivate {
    constructor(private configService: ConfigService, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const issuer = this.configService.get('TOKEN_ISSUER');
        try {
            const ssoToken = request.headers['x-auth-token'] || '';
            if (ssoToken) {
                const decodedSsoToken: UserTokenDTO = await this.jwtService.verifyAsync(ssoToken, {
                    secret: this.configService.get('JWT_SECRET'),
                    ignoreExpiration: false
                }) as UserTokenDTO;
                const roleFromSso = decodedSsoToken?.roles;
                if (!roleFromSso || !roleFromSso.length || !roleFromSso.includes(TERMS.ROLE_SUPER_ADMIN)) {
                    throw new HttpException({
                        status: HttpStatus.FORBIDDEN,
                        error: "Forbidden"
                    }, 403);
                }
                return true;
            } else {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED
                }, 401);
            }
        } catch (error) {
            throw new HttpException(error, 403);
        }
    }
}
