interface Props {
  username: string;
  threadTitle: string;
}

export function ThreadHeader({ username, threadTitle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">
        Send anonymous message to{" "}
        <span className="font-semibold">{username}</span>
      </p>
      <h1 className="text-xl font-semibold tracking-tight">{threadTitle}</h1>
    </div>
  );
}
