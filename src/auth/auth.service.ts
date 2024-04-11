import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService
    ) {}

    async validateUser(username: string, password: string){
        const user = await this.userService.findByUserName(username)
        if(!user) {
            throw new HttpException('Wrong credential information', HttpStatus.NOT_FOUND)
        }
        if(!await bcrypt.compare(password,user.password)){
            throw new HttpException('Wrong credential information', HttpStatus.NOT_FOUND)
        }
        return user
    }

    async login(userid: string, fullname: string, role: string){
        return this.userService.signToken(userid, fullname, role)
    }
}
