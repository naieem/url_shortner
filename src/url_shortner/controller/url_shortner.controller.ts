import {
    BadRequestException,
    Body,
    Controller,
    Get, Param, Post, Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

@Controller('urlshortner')
export class UrlShortnerController {
    constructor() { }
    async createShortUrl() {
        try {
            return { message: 'Created' };
        } catch (error) {
            throw error
        }
    }
}
