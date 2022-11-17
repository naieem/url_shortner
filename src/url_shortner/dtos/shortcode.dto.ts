import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateShortCodeDTO {
    @ApiProperty({
        type: String
    })
    @IsNotEmpty()
    @IsString()
    originalUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    expiryDate: Date;

    @IsNotEmpty()
    @IsString()
    shortCode?: String;
}
