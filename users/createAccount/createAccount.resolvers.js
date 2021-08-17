import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
    ) => {
      try {
        // 유저네임이나 이메일이 DB에 이미 존재하는지 확인
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          throw new Error("This username or password is already taken.");
        }
        // 패스워드 해쉬
        const uglyPassword = await bcrypt.hash(password, 10);
        // 유저정보 저장 및 유저 리턴
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
      } catch (error) {
        return error;
      }
    },
  },
};
