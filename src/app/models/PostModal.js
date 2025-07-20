import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorUrl: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    modifiedDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    breadcrumbs: [
      {
        name: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    likes: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export function getPostModel(connection) {
  return connection.model("Post", PostSchema);
}
