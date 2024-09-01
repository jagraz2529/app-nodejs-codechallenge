import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NewTransactionInput {
  @Field(() => String, { nullable: true })
  readonly accountExternalIdDebit?: string;

  @Field(() => String, { nullable: true })
  readonly accountExternalIdCredit?: string;

  @Field(() => String, { nullable: true })
  readonly tranferTypeId?: string;

  @Field(() => Number, { nullable: false })
  readonly value: number;
}
