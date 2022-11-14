import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UrlShortnerModule } from './url_shortner/url_shortner.module';
import { HttpExceptionFilter } from './utils/exception.handler';
import { ResponseMapperInterceptor } from './utils/response.mapper';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environments/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('TTL'),
        limit: configService.get('LIMIT'),
      }),
      inject: [ConfigService],
    }),
    UrlShortnerModule.register(),
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseMapperInterceptor,
  }],
})
export class AppModule { }
