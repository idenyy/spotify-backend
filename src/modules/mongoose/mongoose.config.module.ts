import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose.config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
  ],
  providers: [MongooseConfigService],
  exports: [MongooseConfigService, MongooseModule],
})
export class MongooseConfigModule {}
