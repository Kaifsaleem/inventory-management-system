import { Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}
  async create(sr: number, createOrderDto: OrderDto) {
    const totalAmount = createOrderDto.weight * createOrderDto.rate;
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      srNo: sr,
      amount: totalAmount,
    });
    return await createdOrder.save();
  }

  async checkSr() {
    const lastOrder = await this.orderModel.findOne().sort({ srNo: -1 }).exec();
    return lastOrder ? lastOrder.srNo + 1 : 1;
  }

  findAll() {
    return this.orderModel.find().exec();
  }

  findOne(id: number) {
    return this.orderModel.findById(id).exec();
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async createMultipleOrders(createOrderDtos: CreateOrderDto) {
    let sr = await this.checkSr();
    const orders: Order[] = [];
    for (const element of createOrderDtos.orders) {
      const order = await this.create(sr, element);
      sr = sr + 1;
      orders.push(order);
    }
    return orders;
  }
}
