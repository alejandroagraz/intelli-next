import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseModule from './database/database.module';
import { AuthsModule } from './auths/auths.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { EditorialsModule } from './editorials/editorials.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './commands/tasks/tasks.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { FormatExcelModule } from './common/format-excel/format-excel.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      exclude: ['/api/(.*)'],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthsModule,
    UsersModule,
    AuthorsModule,
    BooksModule,
    EditorialsModule,
    TasksModule,
    NotificationsModule,
    FormatExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
