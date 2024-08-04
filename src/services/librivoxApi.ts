import axios from 'axios';

const LIBRIVOX_API_URL = 'https://librivox.org/api/feed/audiobooks';

export interface AudioBook {
  id: string;
  title: string;
  author: string;
  url: string;
  coverImage: string;
}

export async function fetchAudiobooks(params: Record<string, string> = {}): Promise<AudioBook[]> {
  try {
    const response = await axios.get(LIBRIVOX_API_URL, {
      params: {
        format: 'json',
        ...params,
      },
    });

    return response.data.books.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.authors[0]?.name || 'Unknown',
      url: book.url_librivox,
      coverImage: book.url_image,
    }));
  } catch (error) {
    console.error('Error fetching audiobooks:', error);
    return [];
  }
}