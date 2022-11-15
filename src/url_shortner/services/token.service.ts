import {
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserTokenDTO } from '../../utils/user.seed';
@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    public async signToken(payload: UserTokenDTO): Promise<{ token: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                const jwt = await this.jwtService.signAsync(payload, {
                    issuer: this.configService.get("TOKEN_ISSUER"),
                    audience: this.configService.get("BASE_URL")
                });
                resolve({ token: jwt });
            } catch (error) {
                reject(false);
            }
        });
    }
}
