import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { StripeService } from '../stripe/stripe.service';
import { StatusTransferEvent } from '../events/status-transfer.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StatusTransaction } from '../common/constants/statusTransaction.constant';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly _clientKafka: ClientKafka,
    private readonly _stripeService: StripeService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  async newTransaction(data: any): Promise<void> {
    try {
      if (parseInt(data.amount) < 1000) {
        const resp = await this._stripeService.generateCharge(
          data.stripePaymentMethodId,
          data.stripeCostumerId,
          parseInt(data.amount),
          data.currency,
          data.paymentMethodType,
        );

        this._clientKafka.emit(
          'topic.transaction.yape',
          JSON.stringify({
            transactionId: data.transactionId,
            status: resp.status,
          }),
        );

        if (
          resp.status == StatusTransaction.PENDING ||
          resp.status == StatusTransaction.PROCESSING
        ) {
          this._eventEmitter.emit(
            'update.status.transfer',
            new StatusTransferEvent(resp.id, data.transactionId),
          );
        }
      } else {
        this._clientKafka.emit(
          'topic.transaction.yape',
          JSON.stringify({
            transactionId: data.transactionId,
            status: StatusTransaction.REJECTED,
          }),
        );
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTransactionStatus(
    id: string,
    transactionId: string,
  ): Promise<void> {
    try {
      const resp = await this._stripeService.getTransaction(id);

      if (
        resp.status == StatusTransaction.PENDING ||
        resp.status == StatusTransaction.PROCESSING
      ) {
        this._eventEmitter.emit(
          'update.status.transfer',
          new StatusTransferEvent(id, transactionId),
        );
      }

      this._clientKafka.emit(
        'topic.transaction.yape',
        JSON.stringify({
          transactionId: transactionId,
          status: resp.status,
        }),
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
