// app/books/page.js or app/books/loading.js
import { Suspense } from "react";
import BooksPageContent from "@/components/books/BooksPageContent";
import BooksLoading from "@/components/ui/BooksLoading";

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksLoading />}>
      <BooksPageContent />
    </Suspense>
  );
}