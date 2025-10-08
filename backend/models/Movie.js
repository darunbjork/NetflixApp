const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be ore than 100 characters'],
    },
    genre: {
      type: [String],
      required: true,
      enum: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Animation' , 'Documentary', 'Crime', 'Adventure'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    director: {
      type: String,
      required: [true, 'Please add a director'],
    },
    year: {
      type: Number,
      required: [true, 'Please add a release year'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '/images/default.jpg',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', MovieSchema);