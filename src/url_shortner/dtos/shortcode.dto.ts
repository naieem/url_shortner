import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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

    @IsOptional()
    @IsString()
    shortCode?: String;
}
