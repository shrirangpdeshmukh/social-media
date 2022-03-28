const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    upVote: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

voteSchema.index({ parentId: 1, createdBy: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
