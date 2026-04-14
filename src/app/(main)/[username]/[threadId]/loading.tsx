import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThreadLoading() {
  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        
        {/* Thread Header Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-7 w-3/4 mt-1" />
        </div>

        {/* Message Composer Skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[80px] w-full rounded-md" />
          <Skeleton className="h-9 w-[60px] rounded-md" />
        </div>

        {/* Message List Skeletons */}
        <div className="flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} size="default" className="w-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5 mt-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
