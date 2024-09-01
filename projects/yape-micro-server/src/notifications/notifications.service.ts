import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StatusTransferEvent } from '../events/status-transfer.event';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly _transactionService: TransactionService) {}

  @OnEvent('update.status.transfer')
  async notifyUser(payload: StatusTransferEvent) {
    await this._transactionService.updateTransactionStatus(
      payload.id,
      payload.transactionId,
    );
  }
}
