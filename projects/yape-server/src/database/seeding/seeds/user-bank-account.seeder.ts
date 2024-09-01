import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from 'src/users/entity/user.entity';
import { UserBankAccountEntity } from 'src/user-bank-account/entity/user-bank-account.entity';
export default class UserCardSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserBankAccountEntity);
    const users = await dataSource.getRepository(UserEntity).find();
    const data = [
      {
        stripePaymentMethodId: 'pm_1Ptx7VEK7WzxCFmHcWA3SQjM',
        accountHolder: 'Jose Alejandro Agraz Godoy',
        nameBank: 'STRIPE TEST BANK',
        country: 'USD',
        last4: 6789,
        isActive: true,
      },
    ];

    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const user: UserEntity = users[i];
        for (let j = 0; j < data.length; j++) {
          const newUserBankAccount: UserBankAccountEntity =
            new UserBankAccountEntity();

          newUserBankAccount.stripePaymentMethodId =
            data[j].stripePaymentMethodId;
          newUserBankAccount.accountHolder = data[j].accountHolder;
          newUserBankAccount.nameBank = data[j].nameBank;
          newUserBankAccount.country = data[j].country;
          newUserBankAccount.last4 = data[j].last4;
          newUserBankAccount.isActive = data[j].isActive;
          newUserBankAccount.user = user;

          await repository.insert([newUserBankAccount]);
        }
      }
    }
  }
}
