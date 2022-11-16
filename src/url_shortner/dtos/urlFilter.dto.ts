import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UrlFilterDTO {
    @ApiProperty()
    @IsOptional()
    @IsString()
    shortCode?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    keyword?: string;
}
