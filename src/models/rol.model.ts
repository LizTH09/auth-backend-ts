import { Types, Schema } from 'mongoose';
import { connectionMongo } from '../configs';

interface IRolSchema {
    _id: Types.ObjectId,
    name: string,
    permissions: Types.ObjectId[],
}

const RolSchema = new Schema<IRolSchema>({
  _id: Types.ObjectId,
  name: {
    required: true,
    type: String
  },
  permissions: [ { type: Types.ObjectId } ],
});

const RolModel = connectionMongo.model<IRolSchema>('rol', RolSchema);

export default RolModel;