import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UrlPair extends Document {
  @Prop()
  fullUrl: string;

  @Prop()
  shortUrl: string;
}

export const UrlPairSchema = SchemaFactory.createForClass(UrlPair);
