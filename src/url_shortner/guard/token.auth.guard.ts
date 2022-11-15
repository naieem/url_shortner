import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TERMS } from 'src/utils/constants';
import { UserSeedDTO } from 'src/utils/user.seed';

@Injectable()
export class TokenAuthGuard implements CanActivate {
    constructor() { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const ssoToken = request.headers['x-auth-token'].replace('Bearer ', '');
            const decodedSsoToken: UserSeedDTO = jwt.decode(ssoToken, { json: true }) as UserSeedDTO;
            const roleFromSso = decodedSsoToken.roles;
            if (!roleFromSso.includes(TERMS.ROLE_SUPER_ADMIN)) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: "Forbidden"
                }, 403);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
