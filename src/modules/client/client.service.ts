import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './client.schema';
import { Invoice } from '../invoice/invoice.schema';
import { Payment } from '../payment/payment.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}
  create(createClientDto: CreateClientDto) {
    const newClient = new this.clientModel(createClientDto);
    return newClient.save();
  }

  findAll() {
    return this.clientModel.find().exec();
  }

  findOne(id: string) {
    return this.clientModel.findById(id).exec();
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.clientModel.findByIdAndUpdate(id, updateClientDto).exec();
  }

  async getClientWithInvoicesAndPayments(clientId: string) {
    // Convert string to ObjectId
    const objectId = new Types.ObjectId(clientId);

    // Get client data
    const client = await this.clientModel.findById(objectId).exec();
    if (!client) {
      throw new Error('Client not found');
    }

    // Get all invoices for this client
    const invoices = await this.invoiceModel
      .find({ clientId: objectId })
      .exec();

    // Get all payments for these invoices
    const invoiceIds = invoices.map((invoice) => invoice._id);
    const payments = await this.paymentModel
      .find({ invoiceId: { $in: invoiceIds } })
      .populate('invoiceId')
      .exec();

    return {
      client,
      invoices,
      payments,
      summary: {
        totalInvoices: invoices.length,
        totalPayments: payments.length,
        totalInvoiceAmount: invoices.reduce(
          (sum, invoice) => sum + invoice.totalAmount,
          0,
        ),
        totalPaymentAmount: payments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        ),
        totalPendingAmount: invoices.reduce(
          (sum, invoice) => sum + invoice.totalPending,
          0,
        ),
      },
    };
  }

  remove(id: string) {
    return this.clientModel.findByIdAndDelete(id).exec();
  }
}
