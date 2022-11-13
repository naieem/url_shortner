import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schema/url.schema';

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
            controllers: [],
            providers: [],
            exports: [],
        };
    }
}
