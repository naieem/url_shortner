import {
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    public async signToken(payload): Promise<{ token: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                const jwt = await this.jwtService.signAsync(payload, {
                    issuer: "YPB",
                    audience: this.configService.get("BASE_URL")
                });
                resolve({ token: jwt });
            } catch (error) {
                reject(false);
            }
        });
    }
}
