import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entity/user.entity';
import { TransactionEntity } from 'src/transaction/entity/transaction.entity';

@Entity({ name: 'user_bank_accounts' })
export class UserBankAccountEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false, length: 60 })
  @IsNotEmpty({ message: 'The stripePaymentMethodId is required' })
  @IsString()
  stripePaymentMethodId: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  @IsNotEmpty({ message: 'The accountHolder is required' })
  @IsString()
  accountHolder: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  @IsNotEmpty({ message: 'The nameBank is required' })
  @IsString()
  nameBank: string;

  @Column({ type: 'varchar', nullable: false, length: 3 })
  @IsNotEmpty({ message: 'The country is required' })
  @IsString()
  country: string;

  @Column({ type: 'numeric', nullable: false })
  @IsNotEmpty({ message: 'The last4 is required' })
  @IsString()
  last4: number;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userBankAccounts, {
    onDelete: 'CASCADE',
  })
  user?: UserEntity;

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.userBankAccount,
  )
  transaction: TransactionEntity[];
}
