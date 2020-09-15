import path from 'path';
import { getRepository } from 'typeorm';
import fs from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      fs.stat(userAvatarFilePath, (err, stats) => {
        if (stats) {
          fs.unlink(userAvatarFilePath, error => {
            if (error) {
              throw new Error('Only authenticated users can change avatar.');
            }
          });
        }
      });
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
