import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/note.css';

axios.defaults.withCredentials = true;

function Notes() {
  const { id } = useParams();
  const [book, setBook] = useState(null);  
  const [note, setNote] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get("http://localhost:3000/book", {
          params: { id }
        });
        console.log(res.data);
        setBook(res.data.book);
        setNote(res.data.book.notes || "");  

        console.log(book);
        console.log(note);
      } catch (err) {
        console.error("Error fetching book data in notes:", err.message);
      }
    }

    fetchBook();
  }, [id]);

  function handleChange(event) {
    setNote(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();  // prevent page reload
    try {
      const res = await axios.post("http://localhost:3000/savenotes", {
        id: book.id,
        note: note
      });
      alert("Note saved successfully!");
      navigate(res.data.redirect);

    } catch (err) {
      console.log("Error in saving note in frontend:", err.message);
    }
  }

  if (!book) return <p className="text-white p-3">Loading...</p>;

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="container px-3">
      <h1 className="head text-black my-2">Notes</h1>

      <div className="container py-5 d-flex flex-wrap gap-4">
        <div className="photo">
          <img
            src={coverUrl}
           
            alt={book.title || "Book cover"}
            style={{ width: "200px", height: "auto" }}
          />
          <h2 className="text-black mt-3">{book.title}</h2>
          <h3 className="text-black">{book.author}</h3>
        </div>

        <div className="content flex-grow-1">
          <div className="containerr">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={book.id} />
              <textarea
                rows="20"
                cols="80"
                name="content"
                className="bg-dark text-white form-control"
                value={note}
                onChange={handleChange}
              />
              <br />
              <button
                className="btn btn-notes green-bg text-white mt-2"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
