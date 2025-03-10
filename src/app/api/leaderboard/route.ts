import { connectDb } from "@/dbconfig/dbconfig";
// import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();

//leaderboard api send the top 10 users with thier username , topSpeed and avgSpeed and testAttempted 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request:NextRequest){
    try{
        const users = await User.find().sort({topSpeed:-1});
        return NextResponse.json({message:"leaderboard found",users},{status:200})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    }catch(error:any){
        return NextResponse.json({message:"failed to load leaderboard"},{status:500})
    }
}