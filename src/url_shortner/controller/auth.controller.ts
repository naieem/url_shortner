import {
    Controller,HttpCode,Post
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenService } from '../services/token.service';
import { UserSeedData } from '../../utils/user.seed';
import { IResponseResults } from '../dtos';
import { SuperAdminTokenGenerationResponseDto } from '../../utils/swagger.dtos';

@ApiCookieAuth()
@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
    constructor(private tokenService: TokenService, private configService: ConfigService) { }

    // ***************
    // url: token/super-admin/sign
    // response: {result, isValid}
    // ***************
    @ApiOperation({
        summary: 'Create super admin token.',
        description: 'Returns super admin token for using in the query part of the shorturls.',
    })
    @ApiResponse({
        status: 200,
        description: 'Super admin token generation.',
        type: SuperAdminTokenGenerationResponseDto
    })
    @Post('token/super-admin/sign')
    @HttpCode(200)
    /**
     * token singin for super admin use case
     * @returns {@link ResponseResults} object
     */
    async singInTokenForSuperadmin(): Promise<IResponseResults> {
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
