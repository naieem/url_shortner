import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlQueriableFields } from '../schema/url.schema';
import { queryMaker, TERMS, urlValidator } from '../../utils/constants';
import { ConfigService } from '@nestjs/config';
import { ICreateShorturlResponse, IUrlRedirectionResponse, CreateShortCodeDTO, UrlFilterDTO, IUrlFilter, IAllUrlResponseResult, IUrlResponse } from '../dtos';


@Injectable()
export class UrlService {
    constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>, private configService: ConfigService) { }
    sayhello(){
        return 'hello';
    }
    /**
     * Handler for creating shortUrl from Original Url
     * @param  {CreateShortCodeDTO} payload
     * @returns Promise {@link ICreateShorturlResponse }
     */
    async createShortUrl(payload: CreateShortCodeDTO): Promise<ICreateShorturlResponse | string> {
        try {
            const isValid = urlValidator(payload.originalUrl);
            if (!isValid) {
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
     * @param options {@link UrlFilterDTO} object
     * @returns Promise - {@link IUrlResponse} object
     */
    async getAllShortUrl(options: UrlFilterDTO): Promise<IUrlResponse> {
        try {
            const query = queryMaker(options);
            const totalCount = await this.urlModel.estimatedDocumentCount();
            const urls = await this.urlModel.find(query).select(UrlQueriableFields).exec();
            return {
                urls: urls,
                resultCount: urls.length,
                totalCount: totalCount
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    /**
     * hanlder for the endpoint which visits tinyurl
     * @param {string} code
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
    /**
     * Remove url from database
     * @param  {string} originalUrl
     * @returns Promise - any
     */
    async removeUrlFromDb(originalUrl: string): Promise<any> {
        try {
            const isValid = urlValidator(originalUrl);
            if (!isValid) {
                throw new Error(TERMS.INVALID_URL);
            }
            return await this.urlModel.deleteOne({ originalUrl: originalUrl });
        } catch (error) {
            throw new Error(error);
        }
    }
}
