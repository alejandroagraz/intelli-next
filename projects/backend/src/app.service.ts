import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Welcome To API Intelli-Next! -> Author: Jose Agraz - email: joseagraz29@gmail.com';
  }
}
