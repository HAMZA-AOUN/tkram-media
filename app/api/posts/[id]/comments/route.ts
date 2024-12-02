import { NextResponse } from "next/server";

export async function GET(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
