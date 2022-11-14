import { ApiProperty } from "@nestjs/swagger";

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