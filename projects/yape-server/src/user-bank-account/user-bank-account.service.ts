import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBankAccountEntity } from './entity/user-bank-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserBankAccountService {
  constructor(
    @InjectRepository(UserBankAccountEntity)
    private readonly _userBankAccountRepository: Repository<UserBankAccountEntity>,
  ) {}

  async getAllUserBankAccounts(): Promise<UserBankAccountEntity[]> {
    return await this._userBankAccountRepository
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.user', 'user')
      .getMany();
  }

  async getBankAccountForLoginUser(
    userId: string,
  ): Promise<UserBankAccountEntity[]> {
    return await this._userBankAccountRepository
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  }

  async findOneByID(id: string): Promise<UserBankAccountEntity> {
    return await this._userBankAccountRepository
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.user', 'user')
      .where('userCard.id = :id', { id: id })
      .getOne();
  }
}
