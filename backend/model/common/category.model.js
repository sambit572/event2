import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    defaultWhyChooseUs: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5; // Maximum 5 points
        },
        message: 'Cannot have more than 5 default "Why Choose Us" points',
      },
    },
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
