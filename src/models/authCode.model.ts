import { Document, InferSchemaType, Schema, Types } from 'mongoose';
import { connectionMongo } from '../configs';
import { DataModel } from '../interfaces/base';

const AuthCode = new Schema({
  code: {
    required: true,
    type: String
  },
  expiredDate: {
    required: true,
    type: Date
  },
  mode: { type: String }, 
  status: {
    default: 'ACTIVED',
    enum: [ 'ACTIVED', 'FINISHED', 'EXPIRED' ],
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: Types.ObjectId,
  }
}, { timestamps: true });

export type authCode = DataModel<InferSchemaType<typeof AuthCode>>

const AuthCodeModel = connectionMongo.model<authCode & Document>('authCode', AuthCode);

export default AuthCodeModel;