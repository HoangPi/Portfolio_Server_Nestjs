import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService
  ) { }
  async findByUserName(username: string) {
    const userDoc = await this.userModel.findOne({ username: username })
    return userDoc
  }
  async signToken(sub: string, fullname: string, role: string) {
    const payload = {
      sub,
      fullname,
      role
    }
    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_KEY'),
      expiresIn: '300s'
    })
    const loggedInUser = await this.userModel.updateOne({ _id: sub }, {
      $set: {
        access_token: access_token
      }
    })
    return { access_token: access_token }
  }

  async create(createUserDto: CreateUserDto) {
    let role = 'user'
    if(createUserDto.username.slice(0,5)==='admin') role='admin'
    const newUser = new this.userModel({
      username: createUserDto.username,
      password: await bcrypt.hash(createUserDto.password, 10),
      fullname: createUserDto.fullname,
      role
      // access_token: '',
    })
    try {
      await newUser.save()
      return { message: "New user added to database" }
    }
    catch (err) {
      console.log(err)
      if (err.code === 11000) {
        throw new HttpException('User name has already been taken', HttpStatus.BAD_REQUEST)
      }
      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    const userDocs = await this.userModel.find()
    const userInfo = userDocs.map((item) => ({
      username: item.username,
      fullname: item.fullname,
      userid: item._id,
      role: item.role
    }))
    return userInfo
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(newName: string, userid: string, role: string) {
    try {
      const updatedDoc = await this.userModel.updateOne({ _id: userid }, {
        $set: {
          fullname: newName
        }
      })
      
      return await this.signToken(userid,newName,role)
    }
    catch(err){
      throw err
    }
  }

  async remove(id: string) {
    try{
      await this.userModel.deleteOne({_id: id})
      return {message: "User removed"}
    }
    catch(err){
      console.log(err)
      throw new HttpException('Internal error',HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeOther(id: string, password: string){
    try{
      const user = await this.userModel.findById(id)
      if(user.role==='admin'){
        throw new HttpException("Cannot remove admin's account from here",HttpStatus.UNAUTHORIZED)
      }
      if(!(await bcrypt.compare(password,user.password))){
        throw new HttpException("Incorrect password", HttpStatus.UNAUTHORIZED)
      }
      await this.userModel.deleteOne({_id:id})
      return {message: "User removed"}
    }
    catch(err){
      console.log(err)
      throw err
    }
  }
}
