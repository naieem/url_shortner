import { ApiProperty } from '@nestjs/swagger';

class Token {
    @ApiProperty()
    token: string;
}
class Urls {
    @ApiProperty()
    originalUrl: string;

    @ApiProperty()
    expiryDate: Date;

    @ApiProperty()
    shortCode: string;

    @ApiProperty()
    hitCounter: Number;
}
class AllUrlsData {
    @ApiProperty({
        type: Urls,
        isArray: true
    })
    urls: Urls[];
    @ApiProperty()
    count: number
}
export class GlobalResponseDto {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    data: any;
}
export class CreateShortUrlResponseDto extends GlobalResponseDto {
    @ApiProperty({
        type: String,
        description: 'Short url for the original long url',
    })
    data: string;
}

export class SuperAdminTokenGenerationResponseDto extends GlobalResponseDto {
    @ApiProperty({
        type: Token,
    })
    data: Token;
}

export class GetAllUrlsDto extends GlobalResponseDto {
    @ApiProperty({
        type: AllUrlsData
    })
    data: AllUrlsData;
}
