import {
    Body,
    Controller, Post, Get, BadRequestException
} from '@nestjs/common';
import { ResponseResults } from '../dtos/response.dto';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { UrlService } from '../services/url_shortner.service';
import { Url } from '../schema/url.schema';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlResponseDto } from 'src/utils/swagger.dtos';

@ApiTags('Url Shortner Controller')
@Controller()
export class UrlShortnerController {
    constructor(private urlService: UrlService, private configService: ConfigService) { }


    /**
     * Create short url for long urls
     * @param urlsPayload 
     * @returns 
     */
    @ApiOperation({
        summary: 'Create Short url',
        description: 'Returns the short url for an original url given into the payload.',
    })
    @ApiResponse({
        status: 200,
        description: 'Give back shorten url.',
        type: CreateShortUrlResponseDto
    })
    @Post('/createshorturl')
    async createShortUrl(@Body() urlsPayload: CreateShortCodeDTO): Promise<ResponseResults> {
        try {
            const shortUrl = await this.urlService.createShortUrl<Url>(urlsPayload);
            return {
                isValid: true,
                result: this.configService.get('BASE_URL') + shortUrl.shortCode
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
