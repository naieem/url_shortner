import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseResults } from '../url_shortner/dtos';

export interface Response<T> {
    success: boolean;
    data: T;
}

@Injectable()
export class ResponseMapperInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map((responseData: IResponseResults) => {
            return {
                success: responseData.isValid,
                data: responseData.result
            }
        }));
    }
}