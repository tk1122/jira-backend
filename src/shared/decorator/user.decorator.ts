import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from '../interface/session.interface';

export const User = createParamDecorator(
  (data, req): JWTPayload => {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return req.user;
  },
);
