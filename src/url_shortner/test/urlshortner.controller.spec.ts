import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { connect, connection } from 'mongoose';
import { TERMS } from '../../utils/constants';
import { UrlShortnerController } from '../controller/url_shortner.controller';
import { IResponseResults, IUrlResponse } from '../dtos';
import { UrlService } from '../services/url_shortner.service';
import { UrlShortnerModule } from '../url_shortner.module';

describe('Urlshortner Module', () => {
    let shortnerController: UrlShortnerController;
    let urlService: UrlService;
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
            // it('truthy value', () => {
            //     expect(urlService.sayhello()).toBe('hellp');
            // });
            it('With Invalid url', async () => {
                try {
                    const info: IResponseResults = await shortnerController.createShortUrl({
                        "originalUrl": "http://google.m",
                        "expiryDate": new Date("2022-11-17T06:49:48.010Z")
                    })
                } catch (error: any) {
                    expect(error.message).toBe('Error: ' + TERMS.INVALID_URL)
                }
            });
            it('With Valid url', async () => {
                expect.assertions(2);
                const info: IResponseResults = await shortnerController.createShortUrl({
                    "originalUrl": "http://google.vom",
                    "expiryDate": new Date("2022-11-17T06:49:48.010Z")
                })
                expect(info.isValid).toBeTruthy();
                expect(info.result).toMatch(new RegExp(TERMS.REGEX_URL_VALIDATION_LOCAL_TEST, 'i'));
            });
            it('With duplicate url', async () => {
                const info: IResponseResults = await shortnerController.createShortUrl({
                    "originalUrl": "http://google.vom",
                    "expiryDate": new Date("2022-11-17T06:49:48.010Z")
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
                try {
                    await urlService.createShortUrl({
                        "originalUrl": "http://googletest.vom",
                        "expiryDate": new Date("2022-11-17T06:49:48.010Z")
                    })
                    const info: IUrlResponse = await urlService.getAllShortUrl()
                    expect(info.resultCount).toBe(2)
                } catch (error: any) {
                    console.log(error)
                }
            });
            // it('With Valid url', async () => {
            //     expect.assertions(2);
            //     const info: IResponseResults = await shortnerController.createShortUrl({
            //         "originalUrl": "http://google.vom",
            //         "expiryDate": new Date("2022-11-17T06:49:48.010Z")
            //     })
            //     expect(info.isValid).toBeTruthy();
            //     expect(info.result).toMatch(new RegExp(TERMS.REGEX_URL_VALIDATION_LOCAL_TEST, 'i'));
            // });
            // it('With duplicate url', async () => {
            //     const info: IResponseResults = await shortnerController.createShortUrl({
            //         "originalUrl": "http://google.vom",
            //         "expiryDate": new Date("2022-11-17T06:49:48.010Z")
            //     })
            //     expect(info.result.message).toBe(TERMS.EXISTING_URL);
            // });
        });
    });
});