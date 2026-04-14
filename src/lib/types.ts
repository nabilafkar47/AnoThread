export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  owner_id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  content: string;
  created_at: string;
}

export interface Reply {
  id: string;
  message_id: string;
  content: string;
  is_owner: boolean;
  created_at: string;
}

// Extended types with relations (for frontend use)
export interface MessageWithReplies extends Message {
  replies: Reply[];
}

export interface ThreadWithMessages extends Thread {
  messages: MessageWithReplies[];
  owner_username: string;
  message_count: number;
}

export interface ThreadCardData extends Thread {
  owner_username: string;
  message_count: number;
}
