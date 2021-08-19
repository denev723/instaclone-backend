import fs from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser },
      ) => {
        const { filename, createReadStream } = await avatar;
        const readStream = createReadStream();
        // local 폴더에 파일을 저장하기 위한 방식 aws 사용시 필요 없음
        const writeStream = fs.createWriteStream(
          process.cwd() + "/uploads/" + filename,
        );
        readStream.pipe(writeStream);

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
          },
        });

        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile",
          };
        }
      },
    ),
  },
};
