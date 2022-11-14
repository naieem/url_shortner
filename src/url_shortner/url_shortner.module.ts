import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controller/auth.controller';
import { UrlShortnerController } from './controller/url_shortner.controller';
import { Url, UrlSchema } from './schema/url.schema';
import { TokenService } from './services/token.service';
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
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRES,
                    }
                }),
            ],
            controllers: [UrlShortnerController, AuthController],
            providers: [UrlService, TokenService],
            exports: [],
        };
    }
}
