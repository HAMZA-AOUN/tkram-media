import { NextResponse } from "next/server";
type tParams = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: tParams }) {
  const { id } = await params;
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
