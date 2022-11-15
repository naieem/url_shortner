import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  UseGuards,
  Param,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ResponseResults } from '../dtos/response.dto';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { UrlService } from '../services/url_shortner.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlResponseDto, GetAllUrlsDto } from '../../utils/swagger.dtos';
import { TokenAuthGuard } from '../guard/token.auth.guard';
import { IUrlRedirectionResponse } from '../dtos/response.interface';
import { Response } from 'express';

@ApiTags('Url Shortner Controller')
@Controller()
export class UrlShortnerController {
  constructor(
    private urlService: UrlService
  ) { }

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
  @HttpCode(200)
  async createShortUrl(@Body() urlsPayload: CreateShortCodeDTO): Promise<ResponseResults> {
    try {
      const urlInfo = await this.urlService.createShortUrl(urlsPayload);
      return {
        isValid: true,
        result: urlInfo,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

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
  @HttpCode(200)
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
  @ApiOperation({
    summary: 'Redirection url for shortcodes',
    description: 'Redirects to the original url after succesfull validation',
  })
  @Get(':shortCode')
  async shortCodeVisit(@Res() response: Response, @Param() params: { shortCode: string; }): Promise<any> {
    try {
      const redirectionUrl: IUrlRedirectionResponse = await this.urlService.getFullUrlFromShortCode(params.shortCode);
      if (redirectionUrl && redirectionUrl?.IsNotFoundStatus) {
        response.status(HttpStatus.NOT_FOUND).send({})
      } else if (redirectionUrl && !redirectionUrl.IsExpired) {
        response.redirect(302, redirectionUrl.url)
      } else {
        response.status(HttpStatus.GONE).send({})
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
