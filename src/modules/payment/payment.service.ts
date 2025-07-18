import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './payment.schema';
import { Invoice, InvoiceStatus } from '../invoice/invoice.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { invoiceId, amount } = createPaymentDto;

    // Validate invoice exists
    const invoice = await this.invoiceModel
      .findById(new Types.ObjectId(invoiceId))
      .exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    // Validate payment amount
    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    if (amount > invoice.totalPending) {
      throw new BadRequestException(
        `Payment amount (${amount}) cannot exceed pending amount (${invoice.totalPending})`,
      );
    }

    // Create the payment
    const payment = new this.paymentModel({
      ...createPaymentDto,
      invoiceId: new Types.ObjectId(invoiceId),
    });

    const savedPayment = await payment.save();

    // Update invoice pending amount
    const newPendingAmount = invoice.totalPending - amount;
    let newStatus: InvoiceStatus;

    if (newPendingAmount === 0) {
      newStatus = InvoiceStatus.PAID;
    } else if (newPendingAmount < invoice.totalAmount) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    } else {
      newStatus = InvoiceStatus.UNPAID;
    }

    await this.invoiceModel
      .findByIdAndUpdate(
        invoice._id,
        {
          totalPending: newPendingAmount,
          status: newStatus,
        },
        { new: true },
      )
      .exec();

    return savedPayment;
  }

  async findAll() {
    return this.paymentModel
      .find()
      .populate('invoiceId', 'srNo totalAmount totalPending status')
      .exec();
  }

  async findOne(id: string) {
    const payment = await this.paymentModel
      .findById(id)
      .populate('invoiceId', 'srNo totalAmount totalPending status')
      .exec();

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByInvoiceId(invoiceId: string) {
    return this.paymentModel
      .find({ invoiceId: new Types.ObjectId(invoiceId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    // Note: Updating payments might require complex logic to revert and reapply
    // invoice pending amount changes. For now, we'll implement basic update
    // without changing the payment amount to avoid complications.
    const { amount, ...updateData } = updatePaymentDto;

    if (amount !== undefined) {
      throw new BadRequestException(
        'Updating payment amount is not allowed. Please create a new payment or contact administrator.',
      );
    }

    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('invoiceId', 'srNo totalAmount totalPending status')
      .exec();

    if (!updatedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return updatedPayment;
  }

  async remove(id: string) {
    // Note: Removing payments would require reverting the invoice pending amount
    // This is a complex operation that should be handled carefully
    const payment = await this.paymentModel.findById(id).exec();

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Get the invoice to revert the pending amount
    const invoice = await this.invoiceModel.findById(payment.invoiceId).exec();

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with ID ${payment.invoiceId.toString()} not found`,
      );
    }

    // Revert the invoice pending amount
    const newPendingAmount = invoice.totalPending + payment.amount;
    let newStatus: InvoiceStatus;

    if (newPendingAmount === invoice.totalAmount) {
      newStatus = InvoiceStatus.UNPAID;
    } else if (newPendingAmount > 0) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    } else {
      newStatus = InvoiceStatus.PAID;
    }

    // Update invoice and remove payment in a transaction-like manner
    await this.invoiceModel
      .findByIdAndUpdate(
        invoice._id,
        {
          totalPending: newPendingAmount,
          status: newStatus,
        },
        { new: true },
      )
      .exec();

    await this.paymentModel.findByIdAndDelete(id).exec();

    return { message: `Payment with ID ${id} has been successfully removed` };
  }

  async getPaymentSummaryByInvoice(invoiceId: string) {
    const payments = await this.findByInvoiceId(invoiceId);
    const totalPaidAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const invoice = await this.invoiceModel
      .findById(invoiceId)
      .select('totalPending totalAmount')
      .exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    const totalAmount = invoice.totalAmount;
    const totalPendingAmount = invoice.totalPending;
    return {
      invoiceId,
      totalPayments: payments.length,
      totalPaidAmount,
      totalAmount,
      totalPendingAmount,
      payments,
    };
  }
}
