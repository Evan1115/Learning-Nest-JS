import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      secretOrKey: 'topSecret51', //to verify the token's signature
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false
    });
  }

  async validate(payload: JWTPayload) { //when we know token is valid, then we extract the payload from token and find the user in database then put the information into request object
    const { username } = payload;
    const user: User = await this.userRepository.findOneBy({ username });
    console.log("hello")
    if (!user) throw new UnauthorizedException();

    return user; //put user info to request body
  }
}
