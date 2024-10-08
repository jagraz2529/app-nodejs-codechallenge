import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrasanctionResolver } from './trasanction.resolver';
import { UsersModule } from '../users/users.module';
import { UserCardModule } from '../user-cars/user-card.module';
import { TransactionEntity } from './entity/transaction.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransactionController } from './transaction.controller';
import { UserBankAccountModule } from '../user-bank-account/user-bank-account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
    UserCardModule,
    UserBankAccountModule,
    KafkaModule,
  ],
  providers: [TrasanctionResolver, TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
