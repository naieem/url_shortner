import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { TERMS } from '../../utils/constants';

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
}
