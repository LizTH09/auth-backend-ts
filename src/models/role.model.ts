import { Types, Schema, InferSchemaType, Document } from 'mongoose';
import { connectionMongo } from '../configs';
import { DataModel } from '../interfaces/base';

const RoleSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  permissions: [ { type: Types.ObjectId } ],
});

export type Role = DataModel<InferSchemaType<typeof RoleSchema>>

const RoleModel = connectionMongo.model<Role & Document>('role', RoleSchema);

export default RoleModel;