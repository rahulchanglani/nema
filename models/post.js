
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // require('./postWatcher'),
    // require('./tag'),
    // require('./rating'),
    // require('./contest'),
    // require('./contestParticipant');
    async = require('async');
//    _ = require('underscore')
//     request = require('request'),
//     moment = require('moment'),
//     PostWatcher = mongoose.model('PostWatcher'),
//     Tag = mongoose.model('Tag'),
//     Contest = mongoose.model('Contest'),
//     Rating = mongoose.model('Rating'),
//     contestParticipant = mongoose.model('contestParticipant'),
//     locationHelper = require('../utils/locationHelper');

// var profanity = require('profanity-util');

var PostSchema = new Schema({
    text: String,
    picture: {
        small: String,
        large: String
    },
    location: {
        name: String,
        loc: {
            type: [Number],
            index: '2d'
        }
    },
    metadata: {
        hashtags : [
            {
                text : String,
                start : Number,
                end : Number
            }
        ],
        mentions : [
            {
                text : String,
                start : Number,
                end : Number
            }
        ],
        links : [
            {
                text : String,
                start : Number,
                end : Number
            }
        ]
    },
    contest: {
        type: Schema.Types.ObjectId,
        ref: 'Contest'
    },
    isWinner: {
      type : Boolean,
      default : false
    },
    blocked: {
      type : Boolean,
      default : false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rateCount: {
        type: Number,
        default: 0
    },
    rateValue: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    reportCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0.0
    }
},
{
  timestamps: {
    createdAt: 'posted_on'
  }
});

// PostSchema.virtual('createdAt').get(function() {
//     if (this["_createdAt"]) return this["_createdAt"];
//     return this["_createdAt"] = moment(this._id.getTimestamp()).unix();
// });
// PostSchema.set('toJSON', {
//     virtuals: true
// });

// PostSchema.statics.updateCommentCount = function(postID) {
//     return new Promise(function(resolve, reject){
//         var Comment = mongoose.model('Comment');
//         Comment
//         .find({post : postID})
//         .populate({path:'user',select:'name image'})
//         .exec(function(err, comments){
//             if(err) return reject(err);
//             if(!comments) return reject(new Error('No comments found.'));
//             var nullComments = _.filter(comments, function(eachComment){return eachComment.user == null});
//             comments = _.filter(comments, function(eachComment){return eachComment.user != null});
//             if(nullComments.length > 0) {
//                 Comment
//                 .remove({_id : {$in : _.pluck(nullComments,'_id')}}, function(err,result){});
//             }
//             Post.where({ _id: postID })
//             .update({commentCount: comments.length}, function(err){
//                 if(err) return reject(err);
//                 resolve();
//             });
//         })
//     })
// }

// PostSchema.statics.updateRatingCount = function(postID) {
//     return new Promise(function(resolve, reject){
//         Rating
//         .find({post : postID})
//         .populate({path:'user',select:'name image'})
//         .exec(function(err, ratings){
//             if(err) return reject(err);
//             if(!ratings) return reject(new Error('No ratings found.'));
//             var nullRatings = _.filter(ratings, function(eachRating){return eachRating.user == null});
//             ratings = _.filter(ratings, function(eachRating){return eachRating.user != null});
//             if(nullRatings.length > 0) {
//                 Rating
//                 .remove({_id : {$in : _.pluck(nullRatings,'_id')}}, function(err,result){});
//             }

//             Post.where({ _id: postID })
//             .update({rateCount: ratings.length}, function(err){
//                 if(err) return reject(err);
//                 resolve();
//             });
//         })
//     })
// }

// PostSchema.methods.ratingByUser = function(userID, callback) {
//     Rating
//         .findOne({
//             user: userID,
//             post: this._id
//         })
//         .exec(function(err, rating) {
//             if (!callback) return;
//             if (rating) {
//                 callback(rating.value);
//             } else {
//                 callback(0);
//             }
//         })
// }

// PostSchema.methods.isWatchedByUser = function(userID, callback) {
//     var PostWatcher = mongoose.model('PostWatcher');
//     PostWatcher
//         .findOne({
//             user: userID,
//             post: this._id
//         })
//         .exec(function(err, watcher) {
//             if (!callback) return;
//             if (watcher) {
//                 callback(true);
//             } else {
//                 callback(false);
//             }
//         })
// }

// PostSchema.pre('save', function(next){
//     if(profanity.check(this.text).length > 0){
//         this.text = profanity.purify(this.text, { obscureSymbol: '$' })[0];
//     }
//     if(this.metadata && this.metadata.hashtags && this.metadata.hashtags.length > 0) {
//         var hashtags = this.metadata.hashtags;
//         for (var i = hashtags.length - 1; i >= 0; i--) {
//             hashtags[i].text = profanity.purify(hashtags[i].text, { obscureSymbol: '$' })[0];
//         };
//         this.metadata.hashtags = hashtags;
//     }
//     next();
// })

// PostSchema.post('save', function(savedPost) {

//     //Reverse Geo-code the location of the post if it's not there already
//     if (savedPost.location.name != undefined && savedPost.location.name.length == 0) {
//         if(savedPost.location.loc[0] && savedPost.location.loc[1]) {
//             async.nextTick(function() {
//             locationHelper
//                 .getAddressFromLatLng(savedPost.location.loc[1], savedPost.location.loc[0])
//                 .then(function(address) {
//                     savedPost.location.name = address;
//                     savedPost.save();
//                 })
//                 .catch(function(err) {
//                     console.log(err);
//                 })
//             });
//         }
//     }
     
//     // The creator of the post by default becomes the watcher of the Post
//     PostWatcher.create({
//         post: savedPost._id,
//         user: savedPost.user
//     }, function(err, watcher) {
//         //Optionally do something over here
//     })

//     //Update the post count for the user
//     increasePostCountForUser(savedPost.user);

//     //Update the Tags used in the post
//     if (savedPost.metadata && savedPost.metadata.hashtags && savedPost.metadata.hashtags.length > 0) {
//         Tag.updateTagUsage(_.pluck(savedPost.metadata.hashtags, 'text'));
//     }

//     //If there is a contest, then Update the contest Participant Count
//     if (savedPost.contest) {
//         changeParticipantCountForContest(savedPost.contest, true);
//         addContestParticipant(savedPost._id, savedPost.user, savedPost.contest);
//     }
// });

// PostSchema.post('remove', function(removedPost) {
//     //Delete the picture
//     var awsController = require('../apiControllers/awsController'),
//     Comment = mongoose.model('Comment'),
//     Contest = mongoose.model('Contest'),
//     contestParticipant = mongoose.model('contestParticipant'),
//     ContestWinner = mongoose.model('ContestWinner'),
//     PostReport = mongoose.model('PostReport'),
//     PostWatcher = mongoose.model('PostWatcher'),
//     Rating = mongoose.model('Rating');
//     //Delete all dependencies
//     //comment, contestWinner, contestParticipant, postReport, postWatcher, rating

//     var smallPicName, largePicName;

//     var splits = removedPost.picture.small.split('/');
//     smallPicName = splits[splits.length - 1];

//     splits = removedPost.picture.large.split('/');
//     largePicName = splits[splits.length - 1];

//     awsController
//     .deleteFile(smallPicName);

//     awsController
//     .deleteFile(largePicName);

//     if (removedPost.contest) {
//         changeParticipantCountForContest(removedPost.contest, false);   
//     }
    
//     Comment
//     .find({post : removedPost._id})
//     .exec(function(err, comments){
//         async.each(comments, function(eachComment, callback){
//             eachComment
//             .remove();
//             callback();
//         },function(err, result){

//         })
//     })

//     contestParticipant
//     .find({post : removedPost._id})
//     .exec(function (err, participants) {
//         async.each(participants, function (eachParticipant, callback) {
//             eachParticipant
//             .remove();
//             callback();
//         }, function(err, result) {

//         })
//     })
    
//     ContestWinner
//     .find({post : removedPost._id})
//     .exec(function(err, winners){
//         async.each(winners, function(eachWinner, callback){
//             eachWinner
//             .remove();
//             callback();
//         },function(err, result){

//         })
//     })

//     PostWatcher
//     .find({post : removedPost._id})
//     .exec(function(err, watchers){
//         async.each(watchers, function(eachWatcher, callback){
//             eachWatcher
//             .remove();
//             callback();
//         },function(err, result){

//         })
//     })

//     Rating
//     .find({post : removedPost._id})
//     .exec(function(err, ratings){
//         async.each(ratings, function(eachRating, callback){
//             eachRating
//             .remove();
//             callback();
//         },function(err, result){

//         })
//     })

//     PostReport
//     .find({post : removedPost._id})
//     .exec(function(err, reports){
//         async.each(reports, function(eachReport, callback){
//             eachReport
//             .remove();
//             callback();
//         },function(err, result){

//         })
//     })
// });

// function increasePostCountForUser(userID) {
//     //Break this functions from the current execution flow
//     async.nextTick(function() {
//         //Find the Post and increase it's comment count
//         User.where({
//                 _id: userID
//             })
//             .update({
//                 $inc: {
//                     postCount: 1
//                 }
//             }, function(err) {
//                 console.log(err);
//             });
//     });
// }

// function changeParticipantCountForContest(contestID, increase) {
//     //Break this functions from the current execution flow
//     async.nextTick(function() {
//         //Find the Contest and increase it's Participant count
//         if (increase) {
//             Contest.where({
//                 _id: contestID
//             })
//             .update({
//                 $inc: {
//                     participantCount: 1
//                 }
//             }, function(err) {
//                 console.log(err);
//             });
//         } else {
//             Contest.where({
//                 _id: contestID
//             })
//             .update({
//                 $inc: {
//                     participantCount: -1
//                 }
//             }, function(err) {
//                 console.log(err);
//             });
//         }
//     });
// }

// function addContestParticipant(postID, userID, contestID) {
//     async.nextTick(function() {
//         var newContestParticipant = new contestParticipant();

//         newContestParticipant.contest = contestID;
//         newContestParticipant.user = userID;
//         newContestParticipant.post = postID;

//         newContestParticipant.save(function (err, contestParticipant) {
//             if (err) {
//                 console.log("error is ", err);
//             }
//             console.log("contest participant is", contestParticipant);
//         });
//     })
// }
mongoose.model('Post', PostSchema);
