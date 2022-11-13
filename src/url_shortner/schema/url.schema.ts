import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';

@Schema({ collection: 'Urls' })
export class Url {

    @Prop({ required: true })
    originalUrl: string;

    @Prop({ required: true })
    shortCode: string;

    @Prop({ required: false })
    expiryDate: string;

    @Prop({ required: false })
    hitCounter: number;

}
export const UrlQueriableFields = ['originalUrl', 'shortCode', 'expiryDate'];
export const UrlSchema = SchemaFactory.createForClass(Url)

export type UrlDocument = Url & Document
