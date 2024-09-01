import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { UserDTO } from 'src/users/dto/user.dto';
import { TransactionDto } from '../../transaction/dto/transaction.dto';

@ObjectType()
export class UserBankAccountDto {
  @Field()
  readonly id: string;

  @Field()
  readonly stripePaymentMethodId: string;

  @Field()
  readonly accountHolder: string;

  @Field()
  readonly nameBank: string;

  @Field()
  readonly country: string;

  @Field()
  readonly last4: string;

  @Field()
  readonly isActive: string;

  @Field(() => UserDTO, { nullable: true })
  readonly user: UserDTO;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
