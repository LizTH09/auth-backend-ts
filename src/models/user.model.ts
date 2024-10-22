import { Document, InferSchemaType, Schema } from 'mongoose';
import { connectionMongo } from '../configs';
import { DataModel } from '../interfaces/base';

export enum UserStatus {
  Pending = 'PENDING',
  Actived = 'ACTIVED',
  Suspended = 'SUSPENDED',
  Deleted = 'DELETED'
}

enum UserDocType{
  Dni = 'DNI',
  Ce = 'CE',
  Curp = 'CURP'
}

export enum UserAccountType{
  Local = 'LOCAL',
  External = 'EXTERNAL',
}

const UserSchema = new Schema({
  accountType: {
    enum: Object.values(UserAccountType),
    required: true,
    type: String
  },
  birthDay: { type: Date },
  country: { type: String },
  deletedAt: { type: Date },
  docNumber: { type: String },
  docType: {
    enum: Object.values(UserDocType),
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
    password: { type: String },
    rememberPassword: { type: Boolean },
  },
  phone: { type: String },
  photo: { type: String },
  roleId: { type: Schema.Types.ObjectId },
  status: {
    default: UserStatus.Pending,
    enum: Object.values(UserStatus),
    required: true,
    type: String
  }
}, { timestamps: true });

export type User = DataModel<InferSchemaType<typeof UserSchema>>

const UserModel = connectionMongo.model<User & Document>('user', UserSchema);

export default UserModel;