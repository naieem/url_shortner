import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsDate, IsNotEmpty } from 'class-validator';

export class CreateShortCodeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    originalUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsDate()
    expiryDate: Date;
}
