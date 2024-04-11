import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_KEY'),
    });
  }

  async validate(payload: any) {
    // console.log(payload)
    // console.log(payload.exp - Date.now()/1000)
    // if(payload.exp < Date.now()) console.log("Token expired")
    return { userId: payload.sub, fullname: payload.fullname, role: payload.role };
  }
}