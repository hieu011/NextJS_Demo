import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const filePath = path.join(process.cwd(), "//asset//MOCK_DATA.csv");
  const results: any = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(NextResponse.json(results));
      })
      .on("error", (err) => {
        reject(NextResponse.json({ error: "Lỗi đọc file CSV", details: err.message }, { status: 500 }));
      });
  })
};
