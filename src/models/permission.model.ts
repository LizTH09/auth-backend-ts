import { Document, InferSchemaType, Schema } from 'mongoose';
import { connectionMongo } from '../configs';
import { DataModel } from '../interfaces/base';

const PermissionSchema = new Schema({
  code: {
    required: true,
    type: String
  },
  description: { type: String },
});

export type Permission = DataModel<InferSchemaType<typeof PermissionSchema>>

const PermissionModel = connectionMongo.model<Permission & Document>('permission', PermissionSchema);

export default PermissionModel;