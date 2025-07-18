import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { softDeletePlugin } from '../plugins/soft-delete.plugin';
import { Connection } from 'mongoose';

const MongooseConnProvider = MongooseModule.forRootAsync({
  imports: [],
  useFactory: async (config: ConfigService) => {
    return {
      uri: config.get('database.connectionString'),
      connectionFactory: (connection: Connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      },
    };
  },
  inject: [ConfigService],
});

export default MongooseConnProvider;
