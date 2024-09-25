import { Schema, Types } from 'mongoose';
import { connectionMongo } from '../configs';

interface IUserSchema {
    firstName: string
    lastName: string
    email: string
    photo?: string
    gender?: string
    phone?: string
    birthDay?: Date
    country?: string
    docNumber?: string
    docType?: 'DNI' | 'CE' | 'CURP'
    localAccount?: {
        password: string
    }
    externalAccount: [
        {
            id: string
            provider: string
        }]
    roleId?: Types.ObjectId
    status: 'ACTIVED' | 'DELETED' | 'SUSPENDED' | 'PENDING'
    deletedAt?: Date
}

const UserSchema = new Schema<IUserSchema>({
  birthDay: Date,
  country: { type: String },
  deletedAt: Date,
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

const UserModel = connectionMongo.model<IUserSchema>('user', UserSchema);

export default UserModel;