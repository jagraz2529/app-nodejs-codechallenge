import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { StatusTransaction } from 'src/common/constants/statusTransaction.constant';
import { UserDTO } from '../../users/dto/user.dto';
import { UserCardDto } from '../../user-cars/dto/user-card.dto';
import { PaymentMethodType } from '../../common/constants';
import { UserBankAccountDto } from '../../user-bank-account/dto/user-bank-account.dto';

@ObjectType()
export class TransactionDto {
  @Field(() => String, { nullable: true })
  readonly id: string;

  @Field(() => Number, { nullable: true })
  readonly amount: number;

  @Field(() => String, { nullable: true })
  readonly type: PaymentMethodType;

  @Field(() => String, { nullable: true })
  readonly status: StatusTransaction;

  @Field(() => UserDTO, { nullable: true })
  readonly user: UserDTO;

  @Field(() => UserCardDto, { nullable: true })
  readonly userCard: UserCardDto;

  @Field(() => UserBankAccountDto, { nullable: true })
  readonly userBankAccount: UserBankAccountDto;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
