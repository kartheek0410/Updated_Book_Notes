import React from 'react';
import axios from 'axios';
import Cards from '../components/cards';
import '../styles/searchbook.css';

axios.defaults.withCredentials = true;

function SearchBooks(props) {
    const books = Array.isArray(props.books) ? props.books : [];

  return (
    <div className='container box'>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul className="box" style={{ listStyle: "none", padding: 0 }}>
          {books.map((book, index) => (
            <li key={index} className="box-items">
              <Cards
                title={book.title}
                author={book.author_name?.[0] || "Unknown"}
                year={book.first_publish_year || "N/A"}
                image={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/150x200?text=No+Cover"
                }
                cover_i={book.cover_i}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBooks;
