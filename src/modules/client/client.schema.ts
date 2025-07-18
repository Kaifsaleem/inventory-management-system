import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class address {
  @Prop({ required: true })
  street: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: false })
  country: string;
  @Prop({ required: false })
  zipCode: string;
}
@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({ type: address, required: true })
  address: address;
}

export type ClientDocument = HydratedDocument<Client>;

export const ClientSchema = SchemaFactory.createForClass(Client);
