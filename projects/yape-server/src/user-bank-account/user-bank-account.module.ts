import { Module } from '@nestjs/common';
import { UserBankAccountService } from './user-bank-account.service';
import { UserBankAccountResolver } from './user-bank-account.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankAccountEntity } from './entity/user-bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBankAccountEntity])],
  providers: [UserBankAccountResolver, UserBankAccountService],
  exports: [UserBankAccountService],
})
export class UserBankAccountModule {}
