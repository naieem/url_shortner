import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveUrlDTO {
    @ApiProperty({
        type: String
    })
    @IsNotEmpty()
    @IsString()
    originalUrl: string;
}
