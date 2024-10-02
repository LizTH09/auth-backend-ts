import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { ERROR } from '../configs';
import AuthCodeModel from '../models/authCode.model';
import UserModel from '../models/user.model';

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
  code: string,
  mode: string,
  userId: string 
}


class AuthActuator { 
  async generateRandomCode() {
    const randomNumber = Math.floor(Math.random() * 10000);
    
    return randomNumber.toString().padStart(4, '0');
  }

  async createNewUser({ birthDay, country, docNumber, docType, email, firstName, gender, lastName, password, phone  } : IUser) {
    const userExist = await UserModel.findOne({ email });
      
    if(userExist) throw new Error(ERROR.EMAIL_ALREADY_EXIST);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await UserModel.create({
      accountType: 'LOCAL',
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
      status: 'PENDING'
    });

    return newUser;
  }

  async sendValidateCode({ code,  mode, userId }: IAuthCode) {

    // LOGICA DE ENVIO A CORREO

    const newCode = AuthCodeModel.create({
      code,
      mode,
      userId
    });

    return newCode; // Retorna el codigo creado(por el momento)
  }

  async updateDocument<T>(model: Model<T>, documentId: string, updateFields: Partial<T>) {
    return await model.findByIdAndUpdate(
      documentId,
      { $set: updateFields },
      { new: true }
    ).lean();
  }
  
  async validateCodeStatus({ code, mode, userId }: IAuthCode) {
    const [ codeExist, userExist ] = await Promise.all([
      AuthCodeModel.findOne({ code, mode, userId }),   
      UserModel.findById(userId)
    ]);
    
    if(!userExist) throw new Error(ERROR.USER_NOT_FOUND);

    if(!codeExist) throw new Error(ERROR.INVALID_CODE);
    
    if(codeExist?.expiredDate &&
      dayjs(codeExist.expiredDate).isBefore(dayjs())) {
      console.log('Updating code status to EXPIRED', codeExist._id);
      await this.updateDocument(AuthCodeModel, codeExist._id.toString(), { status: 'EXPIRED' });
      
      throw new Error(ERROR.CODE_EXPIRED);
    }

    const [ codeFinish, userActived ] = await Promise.all([
      this.updateDocument(AuthCodeModel, codeExist._id.toString(), { status: 'FINISHED' }),
      this.updateDocument(UserModel, userExist._id.toString(), { status: 'ACTIVED' })
    ]);
    
    return { codeFinish, message: 'User Activated', userActived };
  }
}

export default new AuthActuator();