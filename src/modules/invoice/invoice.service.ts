import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './invoice.schema';
import { OrderService } from '../order/order.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    private readonly orderService: OrderService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { clientId, items } = createInvoiceDto;

    // Validate and fetch orders

    const orders = await this.orderService.createMultipleOrders({
      orders: items.map((item) => ({
        particular: item.particular,
        weight: item.weight,
        rate: item.rate,
        clientId,
      })),
    });
    if (!orders || orders.length === 0) {
      throw new Error('No orders were created');
    }
    // Create invoice
    const srNo = await this.getNextSerialNumber();
    console.log(srNo);
    const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
    const invoice = new this.invoiceModel({
      srNo,
      clientId,
      orderIds: orders.map((order) => order._id),
      totalAmount,
      totalWeight: orders.reduce((sum, order) => sum + order.weight, 0),
      totalPending: totalAmount,
    });
    console.log(invoice);

    return await invoice.save();
  }
  // async createByOrder(createInvoiceDto: any) {
  //   const { items } = createInvoiceDto;

  //   // Convert string IDs to ObjectIds
  //   const objectIdArray = orderIds.map((id) => new Types.ObjectId(id));

  //   // Fetch orders by IDs
  //   const orders = await this.orderModel
  //     .find({
  //       _id: { $in: objectIdArray },
  //     })
  //     .exec();

  //   if (orders.length === 0) {
  //     throw new NotFoundException('No orders found with the provided IDs');
  //   }

  //   if (orders.length !== orderIds.length) {
  //     throw new BadRequestException('Some order IDs are invalid or not found');
  //   }

  //   // Check if all orders belong to the same client
  //   const clientIds = [
  //     ...new Set(orders.map((order) => order.clientId.toString())),
  //   ];
  //   if (clientIds.length > 1) {
  //     throw new BadRequestException(
  //       'All orders must belong to the same client',
  //     );
  //   }

  //   // Calculate totals
  //   const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  //   const totalWeight = orders.reduce((sum, order) => sum + order.weight, 0);
  //   const totalPending = totalAmount; // As per requirement, initially total pending equals total amount

  //   // Get next serial number
  //   const srNo = await this.getNextSerialNumber();

  //   // Create invoice
  //   const createdInvoice = new this.invoiceModel({
  //     srNo,
  //     clientId: orders[0].clientId,
  //     orderIds: objectIdArray,
  //     totalAmount,
  //     totalPending,
  //     totalWeight,
  //   });

  //   return await createdInvoice.save();
  // }

  async getNextSerialNumber(): Promise<number> {
    const lastInvoice = await this.invoiceModel
      .findOne()
      .sort({ srNo: -1 })
      .exec();
    console.log(lastInvoice);
    return lastInvoice ? lastInvoice.srNo + 1 : 1;
  }

  async findAll() {
    return await this.invoiceModel.find().populate('clientId', 'name ').exec();
  }

  findOne(id: string) {
    return this.invoiceModel
      .findById(id)
      .populate('clientId', 'name phone address')
      .populate('orderIds', 'srNo particular weight rate amount')
      .exec();
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .populate('clientId', 'name phone')
      .populate('orderIds', 'srNo particular weight rate amount')
      .exec();
  }

  remove(id: string) {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }
}
