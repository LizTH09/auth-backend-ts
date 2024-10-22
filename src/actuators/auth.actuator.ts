import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import JWT from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ERROR, JWT__SECRET_KEY } from '../configs';
import AuthCodeModel, { AuthCodeStatus } from '../models/authCode.model';
import UserModel, { UserStatus, UserAccountType } from '../models/user.model';
import { IContext } from '../interfaces/base';
import { validationCodeTemplate } from '../templates/validationCode';
import RoleModel, { Role } from '../models/role.model';

export interface IUser{
  email: string,
  firstName: string,
  lastName: string,
  birthDay?: string,
  country?: string,
  docNumber?: string,
  docType?: string,
  gender?: string,
  phone?: string,
  password: string
}

export interface IAuthCode{
  code?: string,
  mode: string,
  userId: string,
}

export interface ITypeAccount{
  userId: string,
  type: UserAccountType
}

export interface IValidatePassword{
  userId: string,
  password: string
}

export interface IGenerateToken{
  userId: string,
  email: string,
  roleId?: string,
  timeToExpires?: string
}

export interface IUpdatePassword {
  userId: string;
  newPassword: string;
}

class AuthActuator { 
  async generateRandomCode() {
    const randomNumber = Math.floor(Math.random() * 10000);
    
    return randomNumber.toString().padStart(4, '0');
  }

  async generateToken({ userId, email, roleId, timeToExpires }: IGenerateToken) {
    const token = JWT.sign(
      {
        email,
        roleId,
        userId,
      },
      JWT__SECRET_KEY,
      { expiresIn: timeToExpires }
    );

    return token;
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return await RoleModel.find({}); 
    } catch (error) {
      console.error('Error al obtener los roles:', error);
      throw new Error('No se pudieron obtener los roles'); 
    }
  }

  async createNewUser({ birthDay, country, docNumber, docType, email, firstName, gender, lastName, password, phone  } : IUser) {
    const userExist = await UserModel.findOne({ email });
      
    if(userExist) throw new Error(ERROR.EMAIL_ALREADY_EXIST);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await UserModel.create({
      accountType: UserAccountType.Local,
      birthDay,
      country,
      docNumber,
      docType,
      email,
      firstName,
      gender,
      lastName,
      localAccount: {
        password: hashedPassword 
      },
      phone,
      status: UserStatus.Pending
    });

    return newUser;
  }

  async sendValidateCode({ mode, userId }: IAuthCode,  context: IContext) {
    const code = await this.generateRandomCode();
    const expiredDate = dayjs().add(5, 'm').toDate(); 
    const user = await UserModel.findById(userId).select({ email: 1 });
    
    if(!user) throw new Error(ERROR.USER_NOT_FOUND);
    
    const subject = mode === 'SINGUP' ? 'Código de Activación de Cuenta' : 'Código de Inicio de Sesión';

    const result = await context.mailServerApi.sendMails(validationCodeTemplate({ code: code, subject: subject, toEmail: user?.email }));
    
    if(!result) throw new Error('Error al enviar el codigo');
    
    await AuthCodeModel.create({
      code,
      expiredDate,
      mode,
      userId
    });
    

    return { message: 'Code send successfully', status: 200, success: true };
  }

  async updateDocument<T>(model: Model<T>, documentId: string, updateFields: Partial<T>) {
    return await model.findByIdAndUpdate(
      documentId,
      { $set: updateFields },
      { new: true }
    ).lean();
  }

  async updatePassword({ userId, newPassword }: IUpdatePassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.updateDocument(UserModel, userId, { localAccount: { password: hashedPassword } });
    
    return { message: 'Password updated', status: 200 };
  }
  
  async validateCode({ code, mode, userId }: IAuthCode) {
    const [ codeExist, userExist ] = await Promise.all([
      AuthCodeModel.findOne({ code, mode, userId }),
      UserModel.findById(userId)
    ]);
    
    if(!userExist) throw new Error(ERROR.USER_NOT_FOUND);

    if(!codeExist) throw new Error(ERROR.INVALID_CODE);
    
    const expiredDayNotValid = dayjs(codeExist.expiredDate).isBefore(dayjs());

    if(expiredDayNotValid) {
      await this.updateDocument(AuthCodeModel, codeExist._id.toString(), { status: AuthCodeStatus.Expired });
      
      throw new Error(ERROR.CODE_EXPIRED);
    }

    await Promise.all([
      this.updateDocument(AuthCodeModel, codeExist._id.toString(), { status: AuthCodeStatus.Finished }),
      this.updateDocument(UserModel, userExist._id.toString(), { status: UserStatus.Actived })
    ]);
    
    if(codeExist.mode === 'LOGIN') {
      const { email, _id, roleId } = userExist;

      if(userExist.accountType === UserAccountType.External) {
        const accessToken = await this.generateToken({
          email,
          roleId: roleId?.toString(),
          timeToExpires: '3d',
          userId: _id.toString()
        });

        const refreshToken = await this.generateToken({
          email,
          roleId: roleId?.toString(),
          timeToExpires: '7d',
          userId: _id.toString()
        });

        return {
          accessToken,
          message: 'Login successful',
          refreshToken,
          success: true
        };
      }
    }

    return { message: 'Code validated', success: true };
  }
  
  async validateUser (email : string) {
    const validatedUser = await UserModel.findOne({ email }).lean();
      
    if(validatedUser?.status !== UserStatus.Actived) throw new Error(ERROR.USER_NOT_FOUND);

    return validatedUser;
  }

  async updateTypeAccount ({ userId, type } : ITypeAccount) {
    const userTypeUpdated = this.updateDocument(UserModel, userId, { accountType: type });
    
    return userTypeUpdated;
  }

  async validatePassword({ userId, password }: IValidatePassword) {
    const user = await UserModel.findById(userId).lean();

    if(!user) throw new Error(ERROR.USER_NOT_FOUND);
    
    const storedPassword = user.localAccount?.password;

    if(!storedPassword) throw new Error('PASSWORD NOT FOUND');
  
    const passwordValidated = await bcrypt.compare(password, storedPassword);
  
    if(!passwordValidated) throw new Error('INVALID PASSWORD');

    return { message: 'Password validated successfully', success: true }; 
  }
}

export default new AuthActuator();