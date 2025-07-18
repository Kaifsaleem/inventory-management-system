// import {
//   Catch,
//   ArgumentsHost,
//   ConflictException,
//   Logger,
//   ForbiddenException,
// } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';
// import { getErrorMessages } from '../../common/utils/helper';

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   catch(e: any, host: ArgumentsHost) {
//     // Handle MongoDB unique constraint error
//     if (e?.name === 'MongoServerError') {
//       Logger.error(e.message, 'ConflictException');
//       if (e?.code === 11000) {
//         const errors = getErrorMessages(e);
//         e = new ConflictException(errors);
//       }
//     }

//     if (e?.applicationRef?.name === 'ForbiddenError') {
//       Logger.error(e?.applicationRef?.message, 'ForbiddenException');
//       e = new ForbiddenException(e?.applicationRef?.message);
//     }

//     super.catch(e, host);
//   }
// }

import { ForbiddenError } from '@casl/ability';
import {
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Logger.warn(exception.message, exception.constructor.name);
    switch (exception.constructor) {
      case ForbiddenError:
        super.catch(new ForbiddenException(exception.message), host);
        break;
      default:
        if (!(exception instanceof HttpException)) {
          console.log(exception.constructor);
        }
        super.catch(exception, host);
    }
  }
}
