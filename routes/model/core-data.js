var _ = require('lodash');
var mongoose = require('mongoose');
var ctx = require('../util/conf.js').context();

var Schema = mongoose.Schema;

var EventSchema = new Schema({
  code: String,
  name: String,
  description: String,
  location: {
    id: {
      type: String,
      ref: 'Location',
      required: true
    },
    name: String,
    address: String,
    url: String,
    phone: String,
    coordinates: {
      longitude: Number,
      latitude: Number
    }
  },
  recurrence: {
    rule: String,
    id: Schema.Types.ObjectId
  },
  images: [{
    url: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    created: Date
  }],
  sync: {
    uid: {
      type: String,
      index: true
    },
    lastUpdate: Date
  },
  start: {
    dateTime: Date,
    timeZone: String
  },
  end: {
    dateTime: Date,
    timeZone: String
  },
  sequence: Number,
  categories: [{
    type: String,
    ref: 'Category'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


EventSchema.virtual('id').get(function() {
  return this._id;
});

EventSchema.virtual('duration').get(function() {
  return Math.round((this.end.dateTime - this.start.dateTime) / 360000) / 10;
});
EventSchema.set('toJSON', {
  virtuals: true
});


var CategorySchema = new Schema({
  _id: {
    type: String,
    index: true
  },
  name: String,
  parent: {
    type: String,
    ref: 'Category'
  },
  categories: [{
    type: String,
    ref: 'Category'
  }]
});


CategorySchema.virtual('id').get(function() {
  return this._id;
});
CategorySchema.set('toJSON', {
  virtuals: true
});





var LocationSchema = new Schema({
  code: String,
  name: String,
  description: String,
  address: String,
  url: String,
  phone: String,
  coordinates: {
    longitude: Number,
    latitude: Number
  },
  images: [{
    url: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    created: Date
  }],
  ratings: [],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  score: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

LocationSchema.virtual('id').get(function() {
  return this._id;
});

LocationSchema.set('toJSON', {
  virtuals: true
});


var RatingSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  category: {
    type: String,
    ref: 'Category'
  },
  vote: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

RatingSchema.virtual('id').get(function() {
  return this._id;
});
RatingSchema.set('toJSON', {
  virtuals: true
});


var CommentSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userInfo: {
    picture: String,
    nickname: String,
    link: String
  }
});

CommentSchema.virtual('id').get(function() {
  return this._id;
});
CommentSchema.set('toJSON', {
  virtuals: true
});


var UserSchema = new Schema({
  sync: {
    auth0: String,
    updated_at: Date,
    created_at: Date
  },
  publicInfo: {
    picture: String,
    nickname: String,
    link: String
  },
  ratings: [{
    type: Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  roles: [String]
});


exports.Rating = mongoose.model('Rating', RatingSchema);
exports.Comment = mongoose.model('Comment', CommentSchema);
exports.Category = mongoose.model('Category', CategorySchema);
exports.Event = mongoose.model('Event', EventSchema);
exports.Location = mongoose.model('Location', LocationSchema);
exports.User = mongoose.model('User', UserSchema);
exports.ObjectId = mongoose.Types.ObjectId;

exports.connect = function() {
  mongoose.connect(ctx.MONGO_CONNECTION);
}

exports.disconnect = function() {
  mongoose.disconnect();
}

exports.connect();
