import {
    Controller,Post
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiCookieAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenService } from '../services/token.service';
import { UserSeedData } from '../../utils/user.seed';
import { ResponseResults } from '../dtos/response.dto';
import { SuperAdminTokenGenerationResponseDto } from '../../utils/swagger.dtos';

@ApiCookieAuth()
@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
    constructor(private tokenService: TokenService, private configService: ConfigService) { }

    /**
     * Super admin endpoint
     */

     @ApiOperation({
        summary: 'Create super admin token.',
        description: 'Returns super admin token for using in the query part of the shorturls.',
    })
    @ApiResponse({
        status: 201,
        description: 'Super admin token generation.',
        type: SuperAdminTokenGenerationResponseDto
    })
    @Post('token/super-admin/sign')
    async singInTokenForSuperadmin(): Promise<ResponseResults> {
        try {
            const user = UserSeedData;
            const { token } = await this.tokenService.signToken(user);
            return {
                isValid: true,
                result: { token }
            }
        } catch (error) {
            throw new Error(error);

        }
    }

}
