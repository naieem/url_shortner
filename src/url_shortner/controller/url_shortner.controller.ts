import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ResponseResults } from '../dtos/response.dto';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { UrlService } from '../services/url_shortner.service';
import { Url } from '../schema/url.schema';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlResponseDto, GetAllUrlsDto } from '../../utils/swagger.dtos';
import { TokenAuthGuard } from '../guard/token.auth.guard';

@ApiTags('Url Shortner Controller')
@Controller()
export class UrlShortnerController {
  constructor(
    private urlService: UrlService,
    private configService: ConfigService,
  ) { }

  /**
   * Create short url for long urls
   * @param urlsPayload
   * @returns
   */
  @ApiOperation({
    summary: 'Create Short url',
    description:
      'Returns the short url for an original url given into the payload.',
  })
  @ApiResponse({
    status: 200,
    description: 'Give back shorten url.',
    type: CreateShortUrlResponseDto,
  })
  @Post('/createshorturl')
  async createShortUrl(@Body() urlsPayload: CreateShortCodeDTO): Promise<ResponseResults> {
    try {
      const shortUrl = await this.urlService.createShortUrl<Url>(urlsPayload);
      return {
        isValid: true,
        result: this.configService.get('BASE_URL') + shortUrl.shortCode,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Create short url for long urls
   * @param urlsPayload
   * @returns
   */
  @ApiOperation({
    summary: 'Get all url (Admin endpoint)',
    description: 'Returns all the short urls from db.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all the short urls.',
    type: GetAllUrlsDto,
  })
  @Post('/getallUrls')
  @UseGuards(TokenAuthGuard)
  async getAllUrls(): Promise<ResponseResults> {
    try {
      const shortUrls = await this.urlService.getAllShortUrl();
      return {
        isValid: true,
        result: shortUrls,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post(':shortCode')
  async shortCodeVisit(@Param() params): Promise<ResponseResults | any> {
    try {
      const shortUrls = await this.urlService.getAllShortUrl();
      return {
        isValid: true,
        result: shortUrls,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
