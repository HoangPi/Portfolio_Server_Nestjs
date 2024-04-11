import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule,
  ],
  controllers: [
    UserController,
    
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
