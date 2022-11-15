import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlQueriableFields } from '../schema/url.schema';
import { CreateShortCodeDTO } from '../dtos/shortcode.dto';
import { TERMS } from 'src/utils/constants';
import { ConfigService } from '@nestjs/config';
import { ICreateShorturlResponse, IUrlRedirectionResponse } from '../dtos/response.interface';



@Injectable()
export class UrlService {
    constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>, private configService: ConfigService) { }

    /**
     * Handler for creating shortUrl from Original Url
     * @param  {CreateShortCodeDTO} payload
     * @returns Promise {@link ICreateShorturlResponse }
     */
    async createShortUrl(payload: CreateShortCodeDTO): Promise<ICreateShorturlResponse | string> {
        try {
            const urlRegex = /https?:\/{2}([a-zA-Z1-9])+.[a-zA-Z]{2,4}$/gi;
            const matches = payload.originalUrl.match(urlRegex);
            if (!matches) {
                throw new Error(TERMS.INVALID_URL);
            }
            const existingUrls: Url = await this.urlModel.findOne({ originalUrl: payload.originalUrl })
            if (existingUrls) {
                return {
                    message: TERMS.EXISTING_URL,
                    url: this.configService.get('BASE_URL') + existingUrls.shortCode,
                    expiration: existingUrls.expiryDate
                }
            }
            const url: Url = await this.urlModel.create(payload);
            return this.configService.get('BASE_URL') + url.shortCode;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Handler for retriving all the urls information
     * @returns Promise - {@link Url} array
     */
    async getAllShortUrl(): Promise<Url[]> {
        try {
            return await this.urlModel.find().select(UrlQueriableFields).exec();
        } catch (error) {
            throw new Error(error);
        }
    }
    /**
     * hanlder for the endpoint which visits tinyurl
     * @param {string} code bsghdcsdfkd
     * @returns  Promise - {@link IUrlRedirectionResponse} object
     */
    async getFullUrlFromShortCode(code: string): Promise<IUrlRedirectionResponse> {
        try {
            const today = new Date();
            const url: Url = await this.urlModel.findOne({
                shortCode: code
            }).select(UrlQueriableFields).exec();
            if (url) {
                const expiryDate = new Date(url.expiryDate);
                if (expiryDate < today) {
                    return {
                        IsExpired: true,
                        url: url.originalUrl
                    }
                } else {
                    await this.urlModel.updateOne({ originalUrl: url.originalUrl }, { $set: { hitCounter: url.hitCounter + 1 } });
                    return {
                        IsExpired: false,
                        url: url.originalUrl
                    }
                }
            } else
                return {
                    IsNotFoundStatus: true,
                    IsExpired: false,
                    url: null
                }
        } catch (error) {
            throw new Error(error);
        }
    }
}