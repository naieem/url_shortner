import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';


@Schema({ collection: 'Urls' })
export class Url {

    @Prop({ required: true })
    originalUrl: string;

    @Prop({ required: true, default: nanoid() })
    shortCode: string;

    @Prop({ required: false })
    expiryDate: string;

    @Prop({ required: false, default: 0 })
    hitCounter: number;

}
export const UrlQueriableFields = ['originalUrl', 'shortCode', 'expiryDate','hitCounter'];
export const UrlSchema = SchemaFactory.createForClass(Url)

export type UrlDocument = Url & Document
