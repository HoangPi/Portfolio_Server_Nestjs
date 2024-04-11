import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserModel = HydratedDocument<User>

@Schema()
export class User {
    @Prop({required: true})
    username: string

    @Prop({required: true})
    password: string

    @Prop({required: true})
    fullname: string

    @Prop({default:''})
    access_token: string

    @Prop({default: 'user'})
    role: string
}

export const UserSchema = SchemaFactory.createForClass(User)