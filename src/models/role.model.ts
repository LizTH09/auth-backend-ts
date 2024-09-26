import { Types, Schema } from 'mongoose';
import { connectionMongo } from '../configs';

interface IRoleSchema {
    _id: Types.ObjectId,
    name: string,
    permissions: Types.ObjectId[],
}

const RoleSchema = new Schema<IRoleSchema>({
  _id: Types.ObjectId,
  name: {
    required: true,
    type: String
  },
  permissions: [ { type: Types.ObjectId } ],
});

const RoleModel = connectionMongo.model<IRoleSchema>('role', RoleSchema);

export default RoleModel;