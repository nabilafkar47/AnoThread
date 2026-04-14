import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function SkeletonThreadCard() {
  return (
    <Card size="default" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 min-w-0">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24 mt-1" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div className="flex gap-1 items-center">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-[70px] rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonThreadCard key={i} />
        ))}
      </div>
    </div>
  );
}
