import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const buildHref = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {prevPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildHref(prevPage)}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      )}

      <span className="text-sm text-muted-foreground px-2">
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildHref(nextPage)}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
