import { ApiProperty } from "@nestjs/swagger";

class Token{
    @ApiProperty()
    token:string;
}
export class GlobalResponseDto {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    data: any;
}
export class CreateShortUrlResponseDto extends GlobalResponseDto {
    @ApiProperty({
        type:String,
        description:'Short url for the original long url'
    })
    data: string;
}

export class SuperAdminTokenGenerationResponseDto extends GlobalResponseDto {
    @ApiProperty({
        type:Token
    })
    data: Token;
}