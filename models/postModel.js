const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("votes", {
  ref: "Vote",
  localField: "_id",
  foreignField: "parentId",
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
