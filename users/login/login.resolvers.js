import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // username argument의 유저를 찾음
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      // agrument의 password와 DB의 hash화된 password가 일치하는지 체크
      const verifiedPassword = await bcrypt.compare(password, user.password);
      if (!verifiedPassword) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }
      // 위의 두 과정에서 이상이 없다면 token을 발행하여 user한테 전송
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
