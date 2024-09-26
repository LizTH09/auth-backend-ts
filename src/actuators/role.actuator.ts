import RoleModel from '../models/role.model';
import PermissionModel from '../models/permission.model';
import { Types } from 'mongoose';

class RoleActuator {
  async createRolesAndPermissionsDefault() {
    const permissions = [
      {
        _id: new Types.ObjectId('66f47ffc05565b0894de7527'),
        code: 'ADD_ROLE',
        description: 'Permission that enables the assignment of roles to specific users, allowing customization of access and functions within the system.'
      },
      {
        _id: new Types.ObjectId('66f480190d1662358054af68'),
        code: 'READ',
        description: 'Permission that enables read-only functionality for specific users, allowing them to view information without the ability to modify it.'
      },
      {
        _id: new Types.ObjectId('66f4800e0ae63763ce272850'),
        code: 'WRITE',
        description: 'Permission that enables write functionality to specific users, allowing the creation and modification of certain information on the platform.'
      },
      {
        _id: new Types.ObjectId('66f4802072d305ea609895f4'),
        code: 'DELETE',
        description: 'Permission that allows delete operations to specific users, allowing them to delete records and data from the platform '
      },
    ];
      
    const roles = [
      {
        _id: new Types.ObjectId('66f39ee2fe0e1bc19a0e1d11'),
        name: 'ADMIN',
        permissions: [
          new Types.ObjectId('66f47ffc05565b0894de7527'),
          new Types.ObjectId('66f480190d1662358054af68'),
          new Types.ObjectId('66f4800e0ae63763ce272850'),
          new Types.ObjectId('66f4802072d305ea609895f4'),
        ]
      }
    ];

    const permissionCodes = await PermissionModel.distinct('code', {});
    const newPermissions = permissions.filter(({ code }) => !(permissionCodes.includes(code)));
    await PermissionModel.insertMany(newPermissions);

    const rolesName = await RoleModel.distinct('name', {});
    const newRoles = roles.filter(({ name }) => !(rolesName.includes(name)));
    await RoleModel.insertMany(newRoles);

    return {
      insertedPermissions: newPermissions.length,
      insertedRoles: newRoles.length,
    };
  }
}

export default new RoleActuator();