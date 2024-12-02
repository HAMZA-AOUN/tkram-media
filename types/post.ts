export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}