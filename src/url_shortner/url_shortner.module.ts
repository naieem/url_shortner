import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortnerController } from './controller/url_shortner.controller';
import { Url, UrlSchema } from './schema/url.schema';
import { UrlService } from './services/url_shortner.service';

@Module({})
export class UrlShortnerModule {
    public static register(): DynamicModule {

        return {
            module: UrlShortnerModule,
            imports: [
                MongooseModule.forFeature([
                    {
                        name: Url.name,
                        schema: UrlSchema,
                    }
                ]),
            ],
            controllers: [UrlShortnerController],
            providers: [UrlService],
            exports: [],
        };
    }
}
