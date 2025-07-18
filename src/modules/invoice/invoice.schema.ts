import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Client } from '../client/client.schema';
import { Order } from '../order/order.schema';

export enum InvoiceStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partially paid',
}
@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, unique: true })
  srNo: number;

  @Prop({ type: Types.ObjectId, required: true, ref: Client.name })
  clientId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Order.name }], required: true })
  orderIds: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  totalPending: number;

  @Prop({ required: true })
  totalWeight: number;

  @Prop({
    required: true,
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;
}

export type InvoiceDocument = HydratedDocument<Invoice>;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
