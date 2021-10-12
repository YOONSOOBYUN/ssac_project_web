const user = require("../models/user");
const jwtModule = require("../modules/jwtModule");
const statusCode = require("../modules/statusCode.");

const authController = {
  getProfile: (req, res) => {
    const userInfo = req.userInfo;

    if (userInfo) {
      //있을떄
      res.status(200).json({
        message: "프로필 조회 성공",
        data: userInfo,
      });
    } else {
      res.status(400).json({
        message: "프로필 조회 실패",
      });
    }
  },
  signUp: async (req, res) => {
    const { email, password, nickName } = req.body;

    try {
      const result = await user.findOne({
        $or: [{ email }, { nickName }],
      });
      // 이렇게 쓰면 뭐가 중복되었는지 알기 어렵다
      if (!result) {
        const userModel = new user({ email, password, nickName });
        await userModel.save();
        res.status(statusCode.OK).json({
          message: "회원가입 완료",
        });
      } else {
        res.status(statusCode.CONFLICT).json({
          message: "중복된 이메일 또는 닉네임이 존재합니다.",
        });
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "DB서버 에러" });
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await user.findOne({ email, password });
      if (result) {
        const payload = {
          email: result.email,
          verified: result.verified,
        };
        const token = jwtModule.create(payload);

        res.status(statusCode.OK).json({
          message: "로그인 성공",
          accessToken: token,
        });
      } else {
        res.status(statusCode.CONFLICT).json({ message: "로그인 실패" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "DB서버 오류" });
    }
  },

  deleteuser: async (req, res) => {
    const { password } = req.body;
    const userInfo = req.userInfo;

    try {
      const result = await user.findByIdAndDelete({
        _id: userInfo._id,
        password,
      });
      if (result) {
        res.status(statusCode.OK).json({
          message: "회원 탈퇴 성공",
        });
      } else {
        res.status(statusCode.CONFLICT).json({ message: "PW 불일치" });
      }
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "서버 오류",
      });
    }
  },

  uploadImage: (req, res) => {
    const file = req.file;
    if (file) {
      res.status(200).json({
        message: "이미지 업로드 완료",
        imgUrl: file.location,
      });
    } else {
      res.status(400).json({
        message: "이미지 업로드 실패",
      });
    }
  },
  updateProfile: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params;
    const { type, age, gender, degree, inoDate, porfileImage } = req.body;

    const ownResult = await user.checkAuth({
      userId: id,
      tokenId: userInfo._id,
    });
    if (ownResult === -1) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.DB_ERROR).json({
        message: "DB서버 에러",
      });
    }
    try {
      if (age) {
        if (degree || degree == 0) {
          const result = await user.findByIdAndUpdate(
            id,
            {
              age,
              degree,
            },
            {
              new: true,
            }
          );
          if (!result) {
            res.status(statusCode.NO_CONTENT).json({
              message: "게시물이 존재하지 않습니다.",
            });
          } else {
            res.status(statusCode.OK).json({
              message: "수정 완료",
              data: result,
            });
          }
        } else {
          res.status(statusCode.CONFLICT).json({
            message: "접종 차수를 입력해주시기 바랍니다.",
          });
        }
      } else {
        res.status(200).json({ message: "나이를 입력해주시기 바랍니다." });
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "서버 에러",
      });
    }
  },
};

module.exports = authController;
