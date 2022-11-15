import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlQueriableFields } from '../schema/url.schema';
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

    /**
     * Handler for retriving all the urls information
     * @param payload 
     * @returns 
     */
    async getAllShortUrl(): Promise<Url[]> {
        try {
            return await this.urlModel.find().select(UrlQueriableFields).exec();
        } catch (error) {
            throw new Error(error);
        }
    }
}