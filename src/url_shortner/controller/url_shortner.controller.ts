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
  Delete,
} from '@nestjs/common';
import { RemoveUrlDTO, IResponseResults, CreateShortCodeDTO, IUrlRedirectionResponse, UrlFilterDTO, IAllUrlResponseResult } from '../dtos';
import { UrlService } from '../services/url_shortner.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlResponseDto, GetAllUrlsDto, GlobalResponseDto } from '../../utils/swagger.dtos';
import { TokenAuthGuard } from '../guard/token.auth.guard';
import { Response } from 'express';
import { TERMS } from '../../utils/constants';

@ApiTags('Url Shortner Controller')
@Controller()
export class UrlShortnerController {
  constructor(
    private urlService: UrlService
  ) { }
  // ***************
  // url: createshorturl
  // payload: {originalUrl,expiryDate}
  // response: {success, data}
  // ***************
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
  async createShortUrl(@Body() urlsPayload: CreateShortCodeDTO): Promise<IResponseResults> {
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
  // ***************
  // url: getallUrls
  // authorization: required
  // response: {isValid, result}
  // ***************
  @ApiOperation({
    summary: 'Get all url (Admin endpoint)',
    description: 'Returns all the short urls from db.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all the urls.',
    type: GetAllUrlsDto,
  })
  @Post('/getallUrls')
  @UseGuards(TokenAuthGuard)
  @HttpCode(200)
  async getAllUrls(@Body() filter?: UrlFilterDTO): Promise<IAllUrlResponseResult> {
    try {
      const shortUrls = await this.urlService.getAllShortUrl(filter);
      return {
        isValid: true,
        result: shortUrls
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  // ***************
  // url: (:shortCode)
  // params: {shortCode}
  // response: {redirection, 404,410}
  // ***************
  @ApiOperation({
    summary: 'Redirection url for shortcodes',
    description: 'Redirects to the original url after succesfull validation',
  })
  @ApiResponse({
    status: 302,
    description: 'Returns all the urls.',
    type: GetAllUrlsDto,
  })
  @ApiResponse({
    status: 410,
    description: 'Url expired response.',
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Url not found.',
    type: GlobalResponseDto,
  })
  @Get(':shortCode')
  async shortCodeVisit(@Res() response: Response, @Param() params: { shortCode: string; }): Promise<any> {
    try {
      const redirectionUrl: IUrlRedirectionResponse = await this.urlService.getFullUrlFromShortCode(params.shortCode);
      if (redirectionUrl && redirectionUrl?.IsNotFoundStatus) {
        response.status(HttpStatus.NOT_FOUND).send({
          success: false,
          data: TERMS.NOT_FOUND_URL
        })
      } else if (redirectionUrl && !redirectionUrl.IsExpired) {
        response.redirect(302, redirectionUrl.url)
      } else {
        response.status(HttpStatus.GONE).send({
          success: false,
          data: TERMS.EXPIRED_URL
        })
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  // ***************
  // url: deleteUrl
  // payload: {originalUrl}
  // response: {success, data}
  // ***************
  @ApiOperation({
    summary: 'Delete url (Admin endpoint)',
    description: 'Delete urls from db.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns acknowledged data after deletion',
    type: GlobalResponseDto,
  })
  @Delete('/deleteUrl')
  @UseGuards(TokenAuthGuard)
  @HttpCode(200)
  async deleteShrtUrl(@Body() urlBody: RemoveUrlDTO): Promise<IResponseResults> {
    try {
      const removeResponse = await this.urlService.removeUrlFromDb(urlBody.originalUrl);
      return {
        isValid: true,
        result: removeResponse,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
