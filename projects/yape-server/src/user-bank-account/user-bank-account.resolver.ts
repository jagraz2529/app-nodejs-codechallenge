import { Resolver, Query } from '@nestjs/graphql';
import { UserBankAccountService } from './user-bank-account.service';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { UserBankAccountDto } from './dto/user-bank-account.dto';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedAccount } from 'src/common/decorators';
import { UserBankAccountEntity } from './entity/user-bank-account.entity';

@Resolver()
export class UserBankAccountResolver {
  constructor(
    private readonly _userBankAccountService: UserBankAccountService,
  ) {}

  @Query(() => [UserBankAccountDto])
  @UseGuards(JwtAuthGuard)
  async getAllUserBankAccounts(): Promise<UserBankAccountEntity[]> {
    return await this._userBankAccountService.getAllUserBankAccounts();
  }

  @Query(() => [UserBankAccountDto])
  @UseGuards(JwtAuthGuard)
  async getUserBankAccountsForLoginUser(
    @AuthenticatedAccount() { userId },
  ): Promise<UserBankAccountEntity[]> {
    return await this._userBankAccountService.getBankAccountForLoginUser(
      userId,
    );
  }
}
