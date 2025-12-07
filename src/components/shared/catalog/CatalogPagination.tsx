"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageButton from "@/components/shared/PageButton";
import Ellipsis from "@/components/shared/Ellipsis";
import { getPageWindow } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function CatalogPagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  const { pages, leftEllipsis, rightEllipsis } = getPageWindow(
    totalPages,
    page,
    5
  );

  return (
    <div className="hidden md:flex justify-center mt-[52px]">
      <nav aria-label="Pagination" className="flex items-center gap-3">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-[36px] h-[24px] inline-flex items-center justify-center disabled:opacity-40 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages[0] !== 1 && (
          <>
            <PageButton
              number={1}
              active={page === 1}
              onClick={() => setPage(1)}
            />
            {leftEllipsis && <Ellipsis />}
          </>
        )}

        {pages.map((pn) => (
          <PageButton
            key={pn}
            number={pn}
            active={pn === page}
            onClick={() => setPage(pn)}
          />
        ))}

        {pages[pages.length - 1] !== totalPages && (
          <>
            {rightEllipsis && <Ellipsis />}
            <PageButton
              number={totalPages}
              active={page === totalPages}
              onClick={() => setPage(totalPages)}
            />
          </>
        )}

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-[36px] h-[24px] inline-flex items-center justify-center disabled:opacity-40 cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
