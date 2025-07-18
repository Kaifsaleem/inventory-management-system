import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Client } from '../client/client.schema';

@Schema({ timestamps: true })
export class Order {
  public _id: Types.ObjectId;
  // iwant a field which is sr no. and increment every time a new order is created automatically
  @Prop({ required: true, unique: true })
  srNo: number;

  @Prop({ type: Types.ObjectId, required: true, ref: Client.name })
  clientId: Types.ObjectId;

  @Prop({ required: true })
  particular: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: number;
}

export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);
