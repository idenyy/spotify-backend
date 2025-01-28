import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, disconnect } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}
  private connection: Connection;

  public async onModuleInit(): Promise<void> {
    try {
      const uri = this.configService.getOrThrow<string>('DATABASE_URL');
      this.connection = await connect(uri).then((mongoose) => mongoose.connection);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      throw new Error('Could not connect to MongoDB');
    }
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.connection) {
      await disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}
