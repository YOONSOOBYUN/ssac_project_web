const jwtModule = require("./jwtModule");
const user = require("../models/user");

const authModule = {
  loggedIn: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(409).json({
        //409 회원 인증관련 에러
        message: "토큰 없음",
      });
    }
    const decoded = jwtModule.verify(token);
    // console.log(decoded);
    // console.log(decoded.verified);

    if (decoded === -1) {
      return res.status(409).json({
        message: "만료된 토큰입니다.",
      });
    } else if (decoded === -2) {
      return res.status(409).json({
        message: "유효하지 않은 토큰입니다.",
      });
    } else if (decoded === -3) {
      return res.status(409).json({
        message: "토큰 에러입니다.",
      });
    }

    if (!decoded.verified) {
      if (req.path !== "/profile") {
        return res.status(401).json({
          message: "추가 정보를 입력하시기 바랍니다.",
        });
      }
    }

    let userInfo;
    try {
      userInfo = await user.findOne({ email: decoded.email });
    } catch (error) {
      return res.status(500).json({
        message: "유효하지 않은 유저입니다.",
      });
    }
    // console.log(userInfo);
    req.userInfo = userInfo;

    next();
  },
};

module.exports = authModule;
