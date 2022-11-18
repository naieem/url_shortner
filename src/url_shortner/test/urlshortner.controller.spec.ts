import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { connect, connection } from 'mongoose';
import { TERMS } from '../../utils/constants';
import { UrlShortnerController } from '../controller/url_shortner.controller';
import { IResponseResults, IUrlRedirectionResponse, IUrlResponse } from '../dtos';
import { UrlService } from '../services/url_shortner.service';
import { UrlShortnerModule } from '../url_shortner.module';

describe('Urlshortner Module', () => {
    let shortnerController: UrlShortnerController;
    let urlService: UrlService;
    let validShortCode = '';
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `./environments/${process.env.NODE_ENV}.env`,
                    isGlobal: true,
                }),
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],

                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get<string>('MONGODB_URI_TEST')
                    }),
                    inject: [ConfigService],
                }),
                UrlShortnerModule.register(),
            ],
            controllers: [],
            providers: [],
        }).compile();
        urlService = moduleRef.get<UrlService>(UrlService);
        shortnerController = moduleRef.get<UrlShortnerController>(UrlShortnerController);
        await connect(process.env.MONGODB_URI_TEST)
        const urlCollection = connection.collection('Urls')
        if (urlCollection) {
            await urlCollection.deleteMany({});
        }
    });
    afterAll(async () => {
        connection.dropDatabase();
    });
    /**
     * Controller testing
     */
    describe('UrlShortnerController', () => {
        describe('createshorturl endpoint testing', () => {
            it('With Blacklisted url pattern', async () => {
                try {
                    const info: IResponseResults = await shortnerController.createShortUrl({
                        "originalUrl": "http://xxxx.com",
                        "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                    })
                } catch (error: any) {
                    expect(error.message).toBe('Error: ' + TERMS.BLACKLISTED_MSG)
                }
            });
            it('With Invalid url and Invalid expiry date', async () => {
                try {
                    const info: IResponseResults = await shortnerController.createShortUrl({
                        "originalUrl": "//google.m",
                        "expiryDate": new Date("2022-11-17T06:49:48.010Z")
                    })
                } catch (error: any) {
                    expect(error.message).toBe('Error: ' + TERMS.INVALID_URL)
                }
            });
            it('With Invalid url and valid expiry date', async () => {
                try {
                    const info: IResponseResults = await shortnerController.createShortUrl({
                        "originalUrl": "http://google.m",
                        "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                    })
                } catch (error: any) {
                    expect(error.message).toBe('Error: ' + TERMS.INVALID_URL)
                }
            });
            it('With Valid url and Invalid expiry date', async () => {
                try {
                    const info: IResponseResults = await shortnerController.createShortUrl({
                        "originalUrl": "http://google.vom",
                        "expiryDate": new Date("2022-11-17T06:49:48.010Z")
                    })
                } catch (error: any) {
                    expect(error.message).toBe('Error: ' + TERMS.DATE_EXPIRED)
                }
            });
            it('With Valid url and valid expiry date', async () => {
                expect.assertions(2);
                const info: IResponseResults = await shortnerController.createShortUrl({
                    "originalUrl": "http://google.vom",
                    "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                })
                expect(info.isValid).toBeTruthy();
                expect(info.result).toMatch(new RegExp(TERMS.REGEX_URL_VALIDATION_LOCAL_TEST, 'i'));
            });
            it('With duplicate url', async () => {
                const info: IResponseResults = await shortnerController.createShortUrl({
                    "originalUrl": "http://google.vom",
                    "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                })
                expect(info.result.message).toBe(TERMS.EXISTING_URL);
            });
        });
    });
    /**
     * Service test
     */
    describe('UrlShortnerService', () => {
        describe('UrlShortnerService testing', () => {
            it('get all url', async () => {
                await urlService.createShortUrl({
                    "originalUrl": "http://googletest.vom",
                    "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                })
                const info: IUrlResponse = await urlService.getAllShortUrl()
                expect(info.resultCount).toBe(2)
            });
            it('get filtered url', async () => {
                const info: IUrlResponse = await urlService.getAllShortUrl({
                    keyword: 'tes'
                })
                expect(info.totalCount).toBe(2)
                expect(info.resultCount).toBe(1)
            });
            it('get filtered url result zero', async () => {
                const info: IUrlResponse = await urlService.getAllShortUrl({
                    keyword: 'yes'
                })
                expect(info.totalCount).toBe(2)
                expect(info.resultCount).toBe(0)
            });
            it('check for valid url with valid code', async () => {
                await urlService.createShortUrl({
                    "originalUrl": "http://urlwithvalidexpirydate.vom",
                    "expiryDate": new Date("2024-11-17T06:49:48.010Z")
                })
                const urlData: IUrlResponse = await urlService.getAllShortUrl({
                    keyword: 'expi'
                })
                expect(urlData.resultCount).toBe(1)
                expect(urlData.totalCount).toBe(3)
                validShortCode = urlData.urls[0].shortCode;
                const info: IUrlRedirectionResponse = await urlService.getFullUrlFromShortCode(validShortCode);
                expect(info.IsNotFoundStatus).toBeUndefined()
                expect(info.IsExpired).toBeFalsy()
            });
            it('check for expired url with valid code', async () => {
                const urlData: IUrlResponse = await urlService.getAllShortUrl()
                expect(urlData.totalCount).toBe(3)
                urlData.urls[0].expiryDate = new Date("2022-11-17T06:49:48.010Z");
                await urlService.urlModel.updateOne({ originalUrl: urlData.urls[0].originalUrl }, urlData.urls[0])
                validShortCode = urlData.urls[0].shortCode;
                const info: IUrlRedirectionResponse = await urlService.getFullUrlFromShortCode(validShortCode);
                expect(info.IsNotFoundStatus).toBeFalsy()
                expect(info.IsExpired).toBeTruthy()
            });
            it('check for url with invalid code', async () => {
                const info: IUrlRedirectionResponse = await urlService.getFullUrlFromShortCode('sdhfksjdhdkjhd');
                expect(info.IsNotFoundStatus).toBeTruthy()
                expect(info.IsExpired).toBeFalsy()
            });
        });
    });
});