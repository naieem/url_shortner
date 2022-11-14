import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../schema/url.schema';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { TERMS } from 'src/utils/constants';

@Injectable()
export class UrlService {
    constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) { }

    /**
     * Handler for creating shortUrl from Original Url
     * @param payload 
     * @returns 
     */
    async createShortUrl<TYPO>(payload: CreateShortCodeDTO): Promise<TYPO> {
        try {
            const existingUrls = await this.urlModel.find({ originalUrl: payload.originalUrl })
            if (existingUrls && existingUrls.length) {
                throw new Error(TERMS.EXISTING_URL);
            }
            const url: TYPO | any = await this.urlModel.create(payload);
            return url;
        } catch (error) {
            throw new Error(error);
        }
    }
}