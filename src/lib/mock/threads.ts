export interface Reply {
  id: string;
  content: string;
  isOwner: boolean;
}

export interface Message {
  id: string;
  content: string;
  replies: Reply[];
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
  isPublic: boolean;
  ownerUsername: string;
  messages: Message[];
}

export const MOCK_THREADS: Thread[] = [
  {
    id: "t-1",
    title: "QnA bang",
    createdAt: "Just now",
    messageCount: 0,
    isPublic: true,
    ownerUsername: "nabilafkar",
    messages: [],
  },
  {
    id: "t-2",
    title: "Bebas",
    createdAt: "2 days ago",
    messageCount: 14,
    isPublic: false,
    ownerUsername: "nabilafkar",
    messages: [
      {
        id: "msg-1",
        content: "Saran framework fullstack?",
        replies: [
          { id: "r-1", content: "King laravel", isOwner: true },
          { id: "r-2", content: "Next.js juga oke", isOwner: false },
        ],
      },
      {
        id: "msg-2",
        content: "Info side job",
        replies: [
          { id: "r-3", content: "Pecut AI", isOwner: false },
          { id: "r-4", content: "Gelo", isOwner: true },
        ],
      },
    ],
  },
];
