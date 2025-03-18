import mongoose, { Model } from 'mongoose';

export interface IUser extends mongoose.Document {
	fullname: string;
	email: string;
	password: string;
	username: string;
	joinDate: string;//
	testAttempted: number;
	totalTimePlayed: number;//
	topSpeed: number;
	avgSpeed: number;
	accuracy: number;
	avgaccuracy: number;//
	achievement: string[];
	bio: string;
	profilePicUrl: string;
	country: string;
	lastActive: Date;
	history: {
		speed: number;
		accuracy: number;
		mode: string;//
		testPlayed: string;
	}[];
}

const userSchema = new mongoose.Schema<IUser>({
	fullname: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 50,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		email: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 2000,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		minlength: 3,
		maxlength: 20,
	},
	joinDate: {
		type: String,
		default: "",
	},
	bio: {
		type: String,
		default: "",
	},
	testAttempted: {
		type: Number,
		default: 0,
	},
	totalTimePlayed: {
		type: Number,
		default: 0,
	},
	topSpeed: {
		type: Number,
		default: 0,
	},
	avgSpeed: {
		type: Number,
		default: 0,
	},
	accuracy: {
		type: Number,
		default: 0,
	},
	avgaccuracy: {
		type: Number,
		default: 0,
	},
	achievement: {
		type: [String],
	},
	profilePicUrl: {
		type: String,
		default: "",
	},
	lastActive: {
		type: Date,
		default: Date.now,
	},
	history: {
		type: [
			{
				speed: { type: Number },
				accuracy: { type: Number },
				mode: { type: String },
				testPlayed: { type: String, default: "" },
			},
		],
		default: [],
	},
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
