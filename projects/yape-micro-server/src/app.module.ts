import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TransactionModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
  ],
})
export class AppModule {}
