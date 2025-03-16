import connectDb from "@/dbconfig/dbconfig";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

connectDb();

//leaderboard api send the top 10 users with thier username , topSpeed and avgSpeed and testAttempted 

export async function GET(){
    try{
        const users = await User.find().sort({topSpeed:-1});
        return NextResponse.json({message:"leaderboard found",users},{status:200})
    }catch(error : unknown){
        return NextResponse.json({ message: "failed to load leaderboard \n\n"+error }, {status:500})
    }
}