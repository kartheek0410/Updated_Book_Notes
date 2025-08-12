import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




axios.defaults.withCredentials = true;
function BookCard( props) {
    const navigate = useNavigate();
    
    const book = props.book;
    function handleNotes(event) {
        event.preventDefault();
        console.log("notes pressed for:", book.title);
        if (book.id) {
            navigate(`/notes/${book.id}`);
        } else {
            alert("ISBN not available for this book.");
        }
        
        
    }

    async function handleDelete(event) {
        event.preventDefault();
        // console.log("delete pressed for:", book.title,book.id);
        props.deletebook(book.id);
    }

    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        src={coverUrl}
        alt={book.title || "Book cover"}
        className="bd-placeholder-img card-img-top"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150x200?text=No+Cover")}
      />
      <div className="card-body">
        <h5 className="card-title">{book.title || "Untitled"}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Author: {book.author || "Unknown"}
        </li>
        <li className="list-group-item">
          First Published Year: {book.publish_year || "N/A"}
        </li>
      </ul>
      <div className="card-body">
        {book.id && (
          <button
            className="btn btn-info rounded-pill px-3 text-black mt-2"
            onClick={handleNotes}
          >
            Short Notes
          </button>
        )}

        {book.id && (
          <button
            className="btn btn-danger rounded-pill px-3 text-white mt-2"
            onClick={handleDelete}
          >
            Remove From My Collection
          </button>
        )}
      </div>
    </div>
  );
}

export default BookCard;
