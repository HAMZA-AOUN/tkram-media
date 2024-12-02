import PostsTable from "@/components/PostTable";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center  px-2 lg:px-20 py-32 ">
      <Link
        href="/webSocket"
        className="flex w-full my-4 text-blue-500 font-bold 
      text-2xl hover:text-blue-600 "
      >
        WebSocket UI{" "}
      </Link>
      <div className="h-[1px] w-full bg-gray-300 mb-4" />

      <PostsTable />
    </div>
  );
}
