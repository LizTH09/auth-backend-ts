import { Types, Schema } from 'mongoose';
import { connectionMongo } from '../configs';

interface IPermissionSchema {
    _id: Types.ObjectId,
    code: string,
    description: string,
}

const PermissionSchema = new Schema<IPermissionSchema>({
  _id: Types.ObjectId,
  code: {
    required: true,
    type: String
  },
  description: { type: String },
});

const PermissionModel = connectionMongo.model<IPermissionSchema>('permission', PermissionSchema);

export default PermissionModel;