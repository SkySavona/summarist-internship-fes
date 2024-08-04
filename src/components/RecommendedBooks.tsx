import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { AudioBook, fetchAudiobooks } from '@/services/librivoxApi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface RecommendedBooksProps {
  previouslyListened: string[]; // Array of previously listened book IDs
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ previouslyListened }) => {
  const [recommendedBooks, setRecommendedBooks] = useState<AudioBook[]>([]);

  useEffect(() => {
    async function fetchRecommendedBooks() {
      // For this example, we're just fetching recent books
      // In a real application, you'd implement a recommendation algorithm
      const books = await fetchAudiobooks({ limit: '10' });
      setRecommendedBooks(books);
    }

    fetchRecommendedBooks();
  }, [previouslyListened]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Books</h2>
      <Slider {...settings}>
        {recommendedBooks.map((book) => (
          <div key={book.id} className="px-2">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="mt-2 font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecommendedBooks;