import db from "@/utils/db";
import Food from "@/models/food";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {

  await db.connect();

  const data = await Food.find().lean();


  return NextResponse.json(
    data.map(item => db.convertToObject(item))
    ,
    {
      status: 200,
      statusText: "Foods received successfully!",
    }
  );
}

