import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        try {
            const user = await this.authService.validateUser(username, password);
            if (!user.password) {
                console.log("Do I go here?")
                throw new UnauthorizedException();
            }
            return this.authService.login(String(user._id),user.fullname, user.role);
        }
        catch(err){
            console.log(err)
            throw err;
        }
  }
}