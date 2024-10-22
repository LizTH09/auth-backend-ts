import { Types } from 'mongoose';
import { getGlobalContext } from '../middlewares/context';

export type ObjectIdString = string | Types.ObjectId

export type DataModel<T> = T & {
  _id: ObjectIdString;
}

export declare type Maybe<T> = null | undefined | T;

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type UMaybe<T> = Maybe<T> | undefined

export type IContext = ThenArg<ReturnType<typeof getGlobalContext>>