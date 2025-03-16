// import mongoose from "mongoose";

// export async function connectDb(): Promise<void> {
// 	try {
// 		if (!process.env.MONGODB_URL) {
// 			throw new Error("MONGO_URL is not defined in the environment variables");
// 		}

// 		await mongoose.connect(process.env.MONGODB_URL);

// 		const connection = mongoose.connection;

// 		connection.on("connected", () => {
// 			console.log("Connected to MongoDB");
// 		});

// 		connection.on("error", (error: Error) => {
// 			console.log("Error connecting to MongoDB");
// 			console.error(error);
// 			process.exit(1);
// 		});
// 	} catch (error: unknown) {
// 		console.log("Something went wrong while connecting to DB");
// 		console.error(error);
// 	}
// }

import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDb(): Promise<void> {
  console.log("Going for check");
	// Check if we have a connection to the database or if it's currently connecting
	if (connection.isConnected) {
		console.log("Already connected to the database");
		return;
	}
  console.log("Going for database connection");
	try {
		// Attempt to connect to the database
		const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
		connection.isConnected = db.connections[0].readyState;

		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection failed:", error);

		// Graceful exit in case of a connection error
		process.exit(1);
	}
}

export default connectDb;
