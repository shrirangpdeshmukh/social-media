const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hashtagSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    associatedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hashtagSchema.index({ name: 1 });

const Hashtag = mongoose.model("hashtag", hashtagSchema);

module.exports = Hashtag;
