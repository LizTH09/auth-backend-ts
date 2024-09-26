import { Document, InferSchemaType, Schema, Types } from 'mongoose';
import { connectionMongo } from '../configs';
import { DataModel } from '../interfaces/base';

const UserSchema = new Schema({
  birthDay: { type: Date },
  country: { type: String },
  deletedAt: { type: Date },
  docNumber: { type: String },
  docType: {
    enum: [ 'DNI', 'CE', 'CURP' ],
    type: String,
  },
  email: {
    required: true,
    type: String
  },
  externalAccount: [
    {
      id: { type: String },
      provider: { type: String }
    }
  ],
  firstName: {
    required: true,
    type: String
  },
  gender: { type: String },
  lastName: {
    required: true,
    type: String
  },
  localAccount: {
    password: { type: String }
  },
  phone: { type: String },
  photo: { type: String },
  roleId: { type: Types.ObjectId },
  status: {
    default: 'PENDING',
    enum: [ 'ACTIVED', 'DELETED', 'SUSPENDED', 'PENDING' ],
    required: true,
    type: String
  }
}, { timestamps: true });

export type User = DataModel<InferSchemaType<typeof UserSchema>>

const UserModel = connectionMongo.model<User & Document>('user', UserSchema);

export default UserModel;