import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Card Skeleton */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Indicators Skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-xl">
            <CardHeader className="pb-1.5 pt-4 px-4">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-1">
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Summary Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Table Skeleton */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-9 gap-4 pb-3 border-b">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {/* Table Rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="grid grid-cols-9 gap-4 py-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                <Skeleton key={col} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
