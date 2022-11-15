import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty, IsDateString, Matches } from 'class-validator';
import { TERMS } from '../../utils/constants';

export class CreateShortCodeDTO {
    @ApiProperty({
        type: String
    })
    @IsNotEmpty()
    @Matches(/https?:\/{2}([a-zA-Z1-9])+.[a-zA-Z]{2,4}$/gi, {
        message: TERMS.INVALID_URL
    })
    originalUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    expiryDate: Date;
}
