import { Global, Module } from '@nestjs/common';
import { MongooseModule as MongooseModuleLib } from '@nestjs/mongoose';
import { MongooseService } from './mongoose.service';

@Global()
@Module({
  imports: [
    MongooseModuleLib.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
  ],
  providers: [MongooseService],
  exports: [MongooseService],
})
export class MongooseModule {}
