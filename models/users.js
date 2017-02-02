var mongoose = require('mongoose'),
	//moment = require('moment'),
  	Schema = mongoose.Schema;
var async = require('async');
var Promise = require('promise');

var UserSchema = new Schema({
	name : String,
	username : {type: String, index: true},
	email : {type: String, index: true},
	fbID : {type: String, index: true},
	password : String,
	about : String,
	website : String,
	dob : Date,
	contact : {
		countryCode : Number,
		number : Number
	},
	lastLocation : {
		name : String,
		loc : {
			type : [Number], //[0] : Longitude, [1] : Latitude
			index : '2d'
		}
	},
	gender : {
		type: Number,
		enum : [-1,0,1],
		default : -1
	},
	picture : {
		small : String,
		large : String
	},
	interests : [{
		type : Schema.Types.ObjectId, ref : 'Interest'
	}],
	blockedUsers : [{
		type : Schema.Types.ObjectId, ref : 'User'
	}],
	blockedByUsers : [{
		type : Schema.Types.ObjectId, ref : 'User'
	}],
	commentWhitelistUsers : [{
		type : Schema.Types.ObjectId, ref : 'User'
	}],
  	Brand : {
	  type: Schema.Types.ObjectId,
	  ref: 'Brand'
 	},
	lastSeen : Number,
	followerCount : {type : Number, default : 0 },
	followingCount : {type : Number, default : 0 },
	postCount : {type : Number, default : 0 },
	active : {type : Boolean, default : true},
	hidden : {type : Boolean, default : false},
	verified : {type : Boolean, default : false},
	isBrand : {type : Boolean, default : false},
  	isAdmin : {type : Boolean, default : false},
	isPrivate : {type : Boolean, default : false},
  	allowedContacts : {type : Boolean, default : false},
  	importContactsCount : {type : Number, default : 0},
	notificationSetting : {
		followers : {
			off : {type : Boolean, default : false},
			everyone : {type : Boolean, default : true}
		},
		like : {
			followers : {type : Boolean, default : false},
			off : {type : Boolean, default : false},
			everyone : {type : Boolean, default : true}
		},
		comments : {
			followers : {type : Boolean, default : false},
			off : {type : Boolean, default : false},
			everyone : {type : Boolean, default : true}
		}
	},
	privacySetting : {
		comment : {
			everyone : {type : Boolean, default : true}
		},
		follow : {
			everyone : {type : Boolean, default : true}
		}
	}
},
{
  timestamps: {
	createdAt: 'created_at'
  }
});

// UserSchema.methods.toJSON = function() {
//   var obj = this.toObject();
//   // obj.id = obj._id;
//   if(obj.dob)	obj.dob = moment(obj.dob).format("YYYY/MM/DD");
//   // obj.pagePreferences = this.getPagePreference();
//   // delete obj._id;
//   delete obj.password;
//   delete obj.__v;
//   // delete obj.lastLocation;
//   // delete obj.accounts;
//   return obj;
// }

// UserSchema.statics.updateFollowerCount = function(userID) {
// 	return new Promise(function(resolve, reject){
// 		var UserFollower = mongoose.model('UserFollower');
// 		UserFollower
// 		.find({from : userID})
// 		.exec(function(err, followers){
// 			if(err) return reject(err);
// 			if(!followers) return reject(new Error('No followers found.'));
// 			User.where({ _id: userID })
// 			.update({followerCount: followers.length}, function(err){
// 				if(err) return reject(err);
// 				resolve();
// 			});
// 		})
// 	})
// }

// UserSchema.statics.updateFollowingCount = function(userID) {
// 	return new Promise(function(resolve, reject){
// 		var UserFollowing = mongoose.model('UserFollowing');
// 		UserFollowing
// 		.find({from : userID})
// 		.exec(function(err, followings){
// 			if(err) return reject(err);
// 			if(!followings) return reject(new Error('No followings found.'));
// 			User.where({ _id: userID })
// 			.update({followingCount: followings.length}, function(err){
// 				if(err) return reject(err);
// 				resolve();
// 			});
// 		})
// 	})
// }

// UserSchema.statics.updatePostCount = function(userID) {
// 	return new Promise(function(resolve, reject){
// 		var Post = mongoose.model('Post');
// 		Post
// 		.find({user : userID})
// 		.exec(function(err, posts){
// 			if(err) return reject(err);
// 			if(!posts) return reject(new Error('No posts found.'));
// 			User.where({ _id: userID })
// 			.update({postCount: posts.length}, function(err){
// 				if(err) return reject(err);
// 				resolve();
// 			});
// 		})
// 	})
// }

// UserSchema.methods.getGenderString = function(firstPerson) {
// 	if(firstPerson === undefined || firstPerson === null)
// 		firstPerson = true;
// 	var obj = this.toObject();
// 	var genderString = firstPerson ? "They" : "their";
// 	if(obj.gender == 0)
// 		genderString = firstPerson ? "He" : "his";
// 	else if(obj.gender == 1)
// 		genderString = firstPerson ? "She" : "her";

// 	return genderString;
// }

// UserSchema.methods.getPagePreference = function() {
// 	return {
// 		feed : [
// 			{
//  				id : 1,
// 				name : "global"
//  			},
//  			{
// 				id : 3,
//  				name : "following"
//  			},
// 			{
// 			 	id : 2,
// 			 	name : "nearby"
// 			},
// 			{
// 				id : 4,
// 				name : "trending"
// 			}
// 		],
// 		contests : [
// 			{
// 				id : 1,
// 				name : "nearby"
// 			},
// 			{
// 				id : 2,
// 				name : "global"
// 			}
// 		]
// 	}
// }

// UserSchema.methods.getNewPagePreference = function() {
// 	return {
// 		feed : [
// 			{
// 				id : 5,
// 				name : "famous"
// 			},
// 			{
// 				id : 7,
// 				name : "following"
// 			},
// 			{
// 				id : 6,
// 				name : "trendy"
// 			}
// 		],
// 		contests : [
// 			{
// 				id : 1,
// 				name : "nearby"
// 			},
// 			{
// 				id : 2,
// 				name : "global"
// 			}
// 		],
// 		search : [
// 			{
// 				id : 1,
// 				name : "people"
// 			},
// 			{
// 				id : 2,
// 				name : "posts"
// 			},
// 			{
// 				id : 3,
// 				name : "contests"
// 			}
// 		]
// 	}
// }

// UserSchema.post('save', function(savedUser) {

// 	console.log(savedUser.lastLocation.loc);
// 	console.log(savedUser.lastLocation.name);
// 	//Reverse Geo-code the location of the user if it's not there already
// 	if (savedUser.lastLocation != undefined && savedUser.lastLocation.loc != undefined && savedUser.lastLocation.name != undefined && savedUser.lastLocation.name.length == 0) {

// 		async.nextTick(function() {
// 			locationHelper
// 				.getAddressFromLatLng(savedUser.lastLocation.loc[1], savedUser.lastLocation.loc[0])
// 				.then(function(address) {
// 					savedUser.lastLocation.name = address;
// 					savedUser.save();
// 				})
// 				.catch(function(err) {
// 					console.log(err);
// 				})
// 		});
// 	}
// });

// UserSchema.post('remove', function(removedUser) {
// 	//Delete all the posts made by user
// 	var Post = mongoose.model('Post'),
// 	Comment = mongoose.model('Comment'),
// 	UserFollower = mongoose.model('UserFollower'),
// 	UserFollowing = mongoose.model('UserFollowing'),
// 	UserNotification = mongoose.model('UserNotification'),
// 	UserInterest = mongoose.model('UserInterest');
//   UserContacts = mongoose.model('userContacts');

// 	Post
// 	.find({user : removedUser._id})
// 	.exec(function(err, posts){
// 		async.each(posts,function(eachPost, callback){
// 			eachPost
// 			.remove();
// 		}, function(err){

// 		})
// 	})
// 	//Remove from all userFollower, userFollowing, userInterest, userNotification userContacts tables
// 	UserFollower
// 	.find({to : removedUser._id})
// 	.exec(function(err, followers){
// 		async.each(followers,function(eachFollower, callback){
// 			eachFollower
// 			.remove();
// 		}, function(err){

// 		})
// 	})

// 	UserFollowing
// 	.find({from : removedUser._id})
// 	.exec(function(err, followings){
// 		async.each(followings,function(eachFollowing, callback){
// 			eachFollowing
// 			.remove();
// 		}, function(err){

// 		})
// 	})

// 	UserNotification
// 	.find({userID : removedUser._id})
// 	.exec(function(err, notifications){
// 		async.each(notifications,function(eachNotification, callback){
// 			eachNotification
// 			.remove();
// 		}, function(err){

// 		})
// 	})

// 	Comment
// 	.find({user : removedUser._id})
// 	.exec(function(err, comments){
// 		async.each(comments,function(eachComment, callback){
// 			eachComment
// 			.remove();
// 			Post
// 			.where({
// 				_id: eachComment.post
// 			})
// 			.update({
// 				$inc: {
// 					commentCount: -1
// 				}
// 			}, function(err) {

// 			});
// 		}, function(err){

// 		})
// 	})

//   UserContacts
//   .find({user : removedUser._id})
//   .exec(function(err, contacts){
// 	async.each(contacts,function(eachContact, callback){
// 	  eachContact
// 	  .remove();
// 	}, function(err) {

// 	})
//   })

//   Device
//   .find({user : removedUser._id})
//   .exec(function(err, devices){
//   	async.each(devices, function(eachDevice, callback) {
//   		eachDevice
//   		.remove();
//   	}, function(err) {
  		
//   	})
//   })

// 	// UserInterest
// 	// .find({user : removedUser._id})
// 	// .exec(function(err, posts){
// 	// 	async.each(function(eachPost, callback){
// 	// 		eachPost
// 	// 		.remove();
// 	// 	}, function(err){

// 	// 	})
// 	// })
// });

mongoose.model('User', UserSchema);
