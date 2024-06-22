import db from "@/utils/db";
import Food from "@/models/food";

export const dynamic = "force-dynamic";

export async function GET(request) {

  await db.connect();

  const data = await Food.find().lean();


  return Response.json(
    data.map(item => db.convertToObject(item))
    ,
    {
      status: 200,
      statusText: "Foods received successfully!",
    }
  );
}

