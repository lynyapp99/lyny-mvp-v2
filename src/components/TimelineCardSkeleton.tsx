import { Skeleton } from "@/components/ui/skeleton";

const TimelineCardSkeleton = () => {
  return (
    <div className="carousel-item w-[85%] max-w-[320px]">
      <div className="lyny-card">
        {/* Cover Image Skeleton */}
        <Skeleton className="h-40 w-full rounded-t-2xl" />
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCardSkeleton;
