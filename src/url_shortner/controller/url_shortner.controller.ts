import {
    Body,
    Controller, Post, Get, BadRequestException
} from '@nestjs/common';
import { ResponseResults } from '../dtos/response.dto';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { UrlService } from '../services/url_shortner.service';
import { Url, UrlSchema } from '../schema/url.schema';
import { ConfigService } from '@nestjs/config';

@Controller()
export class UrlShortnerController {
    constructor(private urlService: UrlService, private configService: ConfigService) { }


    /**
     * Create short url for long urls
     * @param urlsPayload 
     * @returns 
     */
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
