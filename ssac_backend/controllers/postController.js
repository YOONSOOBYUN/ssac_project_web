const post = require("../models/post");
const statusCode = require("../modules/statusCode.");
const postsController = {
  createPost: async (req, res) => {
    const userInfo = req.userInfo;
    // console.log(userInfo);
    const { title, content, tags, category } = req.body;
    const postModel = new post({
      title,
      content,
      category,
      tags,
      publishedDate: new Date(),
      writer: userInfo._id,
    });

    try {
      const result = await postModel.save();
      res.status(statusCode.OK).json({
        message: "저장 성공",
        data: result,
      });
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  readAllPost: async (req, res) => {
    try {
      const result = await post.find().populate("writer", "nickName");
      console.log(result);
      if (!result)
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ message: "데이터가 없습니다." });

      res.status(statusCode.OK).json({
        message: "조회 성공",
        data: result,
      });
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },
  readDetailpost: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await post.findById(id);
      if (!result)
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ message: "데이터가 없습니다." });

      res.status(statusCode.OK).json({
        message: "조회 성공",
        data: result,
      });
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },

  updatepost: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params;
    const { title, content, tags, category } = req.body;

    const ownResult = await post.checkAuth({
      postId: id,
      writerId: userInfo._id,
    });
    console.log(ownResult);
    if (ownResult === -1) {
      return res
        .status(statusCode.FORBIDDEN)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }

    try {
      const result = await post.findByIdAndUpdate(
        id,
        {
          title,
          content,
          tags,
          updatedDate: new Date(),
          category,
        },
        { new: true } // 업데이트 하고 난 후의 결과값 반환
      );
      console.log(result);
      res.status(statusCode.OK).json({
        message: "수정 완료",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "게시물이 존재하지 않습니다",
        error,
      });
    }
  },
  deletepost: async (req, res) => {
    const userInfo = req.userInfo;
    const { id } = req.params; // 게시물의 _id

    // 일치하는 회원인지 아닌지 확인

    const ownResult = await post.checkAuth({
      postId: id,
      writerId: userInfo._id,
    });
    console.log(ownResult);
    if (ownResult === -1) {
      return res
        .status(statusCode.FORBIDDEN)
        .json({ message: "접근 권한이 없습니다." });
    } else if (ownResult === -2) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }

    try {
      await post.findByIdAndDelete(id);
      res.status(statusCode.OK).json({
        message: "삭제 성공",
      });
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "DB 서버 에러",
      });
    }
  },

  comment: async (req, res) => {
    const { commentContent } = req.body;
    const { id } = req.params;
    const userInfo = req.userInfo;
    const comment = {
      commentContent,
      commentDate: new Date(),
      commentWriter: userInfo._id,
    };

    const collection = await post.findOne({ _id: id });
    collection.comment.push(comment);
    console.log(collection.comment);
    const result = await post.findByIdAndUpdate(
      id,
      { comment: collection.comments },
      { new: true }
    );
    try {
      res.status(statusCode.OK).json({
        message: "게시물 저장 완료",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "오류",
      });
    }
  },
};

module.exports = postsController;
