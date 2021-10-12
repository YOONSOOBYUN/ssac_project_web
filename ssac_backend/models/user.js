const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  nickName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: null },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["male", "female"], default: "male" },
  degree: { type: Number, default: 0 },
  inoDate: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  profileImage: { type: String, default: null },
  //추가정보를 입력해주는 것이기 때문에 default값을 설정해주는게 좋다
});

userSchema.statics.checkAuth = async function (params) {
  const { userId, tokenId } = params;
  try {
    const ownResult = await this.findOne({ _id: userId });
    const ownId = ownResult._id; //글쓴이의 아이디가 생성
    console.log(ownResult);
    console.log(ownId);

    if (ownId.toString() !== tokenId.toString()) {
      return -1;
    }
    return 1;
  } catch (error) {
    return -2;
  }
};

module.exports = mongoose.model("user", userSchema);
