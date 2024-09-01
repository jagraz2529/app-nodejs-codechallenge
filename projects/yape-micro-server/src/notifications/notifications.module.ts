import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
