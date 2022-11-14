import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateShortCodeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    originalUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    expiryDate: Date;
}
