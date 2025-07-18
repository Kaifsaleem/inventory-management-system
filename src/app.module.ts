import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { OrderModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ConfigProvider } from './global/providers/config.provider';
import { PaymentModule } from './modules/payment/payment.module';
import MongooseConnProvider from './global/providers/mongoose-conn.provider';
import EventEmitterProvider from './global/providers/event-emiter.provider';

@Module({
  imports: [
    ConfigProvider,
    MongooseConnProvider,
    EventEmitterProvider,
    ClientModule,
    OrderModule,
    InvoiceModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
