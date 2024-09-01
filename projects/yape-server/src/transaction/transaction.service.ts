import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { NewTransactionInput } from './inputs/new-transaction.input';
import { UserCardService } from 'src/user-cars/user-card.service';
import { UsersService } from 'src/users/users.service';
import {
  StatusTransaction,
  CurrencyType,
  PaymentMethodType,
} from 'src/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { DataTransactionDto } from 'src/common/dtos';
import { GetTransactionInput } from './inputs/get-transaction.input';
import { UserBankAccountService } from '../user-bank-account/user-bank-account.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
    private readonly _userCardService: UserCardService,
    private readonly _userBankAccountService: UserBankAccountService,
    private readonly _userService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly _clientKafka: ClientKafka,
  ) {}

  async getTransactions(
    data: GetTransactionInput,
  ): Promise<TransactionEntity[]> {
    const queryBuilder =
      this._transactionRepository.createQueryBuilder('transaction');

    queryBuilder
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.userCard', 'userCard')
      .leftJoinAndSelect('userCard.cardType', 'cardType')
      .leftJoinAndSelect('transaction.userBankAccount', 'userBankAccount');

    if (data.transactionExternalId) {
      queryBuilder.where('transaction.id = :transactionId', {
        transactionId: data.transactionExternalId,
      });
    }

    if (data.transactionStatus) {
      queryBuilder.andWhere('transaction.status = :status', {
        status: data.transactionStatus.name,
      });
    }

    if (data.transactionType) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: data.transactionType.name,
      });
    }

    if (data.value) {
      queryBuilder.andWhere('transaction.amount = :amount', {
        amount: data.value,
      });
    }

    if (data.cardId) {
      queryBuilder.andWhere('userCard.id = :cardId', {
        cardId: data.cardId,
      });
    }

    if (data.bankAccountId) {
      queryBuilder.andWhere('userBankAccount.id = :bankAccountId', {
        bankAccountId: data.bankAccountId,
      });
    }

    if (data.cardTypeName) {
      queryBuilder.andWhere('cardType.name ILIKE :cardTypeName', {
        cardTypeName: `%${data.cardTypeName}%`,
      });
    }

    if (data.createdAt) {
      queryBuilder.andWhere('DATE(transaction.createdAt) = :createdAt', {
        createdAt: moment(data.createdAt).format('YYYY-MM-DD'),
      });
    }

    return await queryBuilder.getMany();
  }

  async newTransaction(
    data: NewTransactionInput,
    userId: string,
  ): Promise<TransactionEntity> {
    try {
      const transaction = new TransactionEntity();

      if (
        (data.accountExternalIdCredit || data.accountExternalIdDebit) &&
        data.tranferTypeId
      ) {
        throw new HttpException(
          'You can only specify one payment method',
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (data.accountExternalIdCredit || data.accountExternalIdDebit) {
        if (data.accountExternalIdCredit && data.accountExternalIdDebit) {
          throw new HttpException(
            'You can only specify one payment method',
            HttpStatus.NOT_IMPLEMENTED,
          );
        }

        const cardId = data.accountExternalIdCredit
          ? data.accountExternalIdCredit
          : data.accountExternalIdDebit;

        const userCard = await this._userCardService.findOneByID(cardId);

        if (!userCard)
          throw new HttpException(
            `Card ID: ${cardId} not found`,
            HttpStatus.NOT_FOUND,
          );

        if (userId != userCard.user.id)
          throw new HttpException(
            `Card ID: ${cardId} does not belong to your user`,
            HttpStatus.BAD_REQUEST,
          );

        transaction.userCard = userCard;
        transaction.type = PaymentMethodType.CARD;
      } else if (data.tranferTypeId) {
        const userBankAccount = await this._userBankAccountService.findOneByID(
          data.tranferTypeId,
        );

        if (!userBankAccount)
          throw new HttpException(
            `Bank account ID: ${data.tranferTypeId} not found`,
            HttpStatus.NOT_FOUND,
          );

        transaction.userBankAccount = userBankAccount;
        transaction.type = PaymentMethodType.US_BANK_ACCOUNT;
      }

      const user = await this._userService.findOneByID(userId);

      if (!user)
        throw new HttpException(
          `User ID: ${userId} not found`,
          HttpStatus.NOT_FOUND,
        );

      transaction.amount = data.value;
      transaction.status = StatusTransaction.PENDING;
      transaction.user = user;

      const resp = await this._transactionRepository.save(transaction);

      const dataTransaction: DataTransactionDto = new DataTransactionDto();
      dataTransaction.stripePaymentMethodId = resp.userCard
        ? resp.userCard.stripePaymentMethodId
        : resp.userBankAccount.stripePaymentMethodId;
      dataTransaction.stripeCostumerId = user.stripeCostumerId;
      dataTransaction.currency = CurrencyType.USD;
      dataTransaction.paymentMethodType = resp.type;
      dataTransaction.amount = resp.amount;
      dataTransaction.transactionId = resp.id;

      this._clientKafka.emit('topic.yape', JSON.stringify(dataTransaction));
      return resp;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateStatusTransaction(data: any): Promise<void> {
    try {
      const transaction = await this.findOneByID(data.transactionId);
      if (transaction) {
        if (data.status == StatusTransaction.SUCCEEDED) {
          transaction.status = StatusTransaction.APPROVED;
        } else if (data.status == StatusTransaction.PROCESSING) {
          transaction.status = StatusTransaction.PROCESSING;
        } else {
          transaction.status = StatusTransaction.REJECTED;
        }

        await this._transactionRepository.save(transaction);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<TransactionEntity> {
    return await this._transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.id = :id', { id: id })
      .getOne();
  }
}
