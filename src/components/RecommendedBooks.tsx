import React, { useEffect } from "react";
import { Book } from "@/types/book";

interface RecommendedBooksProps {
  currentBook: Book;
  allBooks: Book[];
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({
  currentBook,
  allBooks,
}) => {
  const getRecommendedBooks = () => {
    const tagCounts = allBooks.reduce((acc, book) => {
      book.tags.forEach((tag) => {
        const lowercaseTag = tag.toLowerCase();
        acc[lowercaseTag] = (acc[lowercaseTag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const targetTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    const recommended = allBooks
      .filter(
        (book) =>
          book.id !== currentBook.id &&
          book.tags.some((tag) => targetTags.includes(tag.toLowerCase()))
      )
      .slice(0, 8);

    console.log("Recommended books:", recommended);
    return recommended;
  };
  const recommendedBooks = getRecommendedBooks();

  useEffect(() => {
    console.log("Current book:", currentBook);
    console.log("All books:", allBooks);
  }, [currentBook, allBooks]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {recommendedBooks.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md p-4">
          <img
            src={book.imageLink}
            alt={book.title}
            className="w-full h-48 object-cover mb-2 rounded"
          />
          <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{book.author}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{book.averageRating.toFixed(1)} ★</span>
            <span>{Math.floor(Math.random() * 20 + 5)}m</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedBooks;
