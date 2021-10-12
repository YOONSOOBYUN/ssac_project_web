const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Number, required: true, default: 0 },
  tags: [{ type: String, default: null }],
  // tags :[String]
  publishedDate: { type: Date, default: new Date() },
  updatedDate: { type: Date, default: null },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    //참조 받는게 board, 참조하는게 user
    ref: "user",
  },
  comments: [
    {
      commentwriter: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      commentContent: { type: String, default: null },
      commentDate: { type: Date, default: new Date() },
    },
  ],
  // 복수개의 데이터는 배열로 받으면 됨
});

// this => model or schema
postSchema.statics.checkAuth = async function (params) {
  const { postId, writerId } = params;
  try {
    const ownResult = await this.findOne({ _id: postId });
    const ownId = ownResult.writer; //글쓴이의 아이디가 생성
    console.log(typeof ownId);
    if (ownId.toString() !== writerId.toString()) {
      // 만약 글쓴이 아이디와 서버 아이디가 같지 않다면
      return -1;
      // res.status(409).json({ message: "접근 권한이 없습니다." });
    }
    return 1;
  } catch (error) {
    return -2;
    // res.status(500).json({
    //   message: "DB 서버 에러",
    // });
  }
};

//this => document of data instance
postSchema.methods.checkMe = function () {
  this.title;
};

module.exports = mongoose.model("post", postSchema);
