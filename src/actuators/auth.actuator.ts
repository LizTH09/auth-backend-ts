import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { ERROR } from '../configs';

interface CreateNewUser{
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

class AuthActuator { 
  async createNewUser({ birthDay, country, docNumber, docType, email, firstName, gender, lastName, password, phone  } : CreateNewUser) {
    const userExist = await UserModel.findOne({ email });
      
    if(userExist) throw new Error(ERROR.EMAIL_ALREADY_EXIST);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new UserModel({
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

    const newUser = await user.save();

    return newUser;
  }
}

export default new AuthActuator();