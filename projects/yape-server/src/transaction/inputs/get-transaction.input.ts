import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { createGQLEnumType } from '../../common/decorators';
import { PaymentMethodType } from '../../common/constants';
import { StatusTransaction } from '../../common/constants';

const PaymentMethodTypeGQLEnum = createGQLEnumType(PaymentMethodType);
registerEnumType(PaymentMethodTypeGQLEnum, { name: 'PaymentMethodType' });

const StatusTransactionGQLEnum = createGQLEnumType(StatusTransaction);
registerEnumType(StatusTransactionGQLEnum, { name: 'StatusTransaction' });

@InputType()
export class TransactionType {
  @Field(() => PaymentMethodTypeGQLEnum!, { nullable: true })
  readonly name: PaymentMethodType;
}

@InputType()
export class TransactionStatus {
  @Field(() => StatusTransactionGQLEnum!, { nullable: true })
  readonly name: StatusTransaction;
}

@InputType()
export class GetTransactionInput {
  @IsOptional()
  @IsUUID('4')
  @Field(() => String, { nullable: true })
  readonly transactionExternalId?: string;

  @IsOptional()
  @IsUUID('4')
  @Field(() => String, { nullable: true })
  readonly cardId?: string;

  @IsOptional()
  @IsUUID('4')
  @Field(() => String, { nullable: true })
  readonly bankAccountId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly cardTypeName?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  readonly value?: number;

  @Field(() => TransactionType, { nullable: true })
  readonly transactionType?: TransactionType;

  @Field(() => TransactionStatus, { nullable: true })
  readonly transactionStatus?: TransactionStatus;

  @Field(() => String, { nullable: true })
  readonly createdAt?: string;
}
