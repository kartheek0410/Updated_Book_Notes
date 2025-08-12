import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Cards(props) {
  const [userCollection, setCollection] = useState([]);
  const hiddenInputRef = useRef();

  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await axios.get("http://localhost:3000/getcollection");
        setCollection(res.data.collection || []);
      } catch (err) {
        console.log("Error in card for getting user collection", err.message);
      }
    }
    fetchCollection();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    // console.log(payload); // should always have collection_name now

    try {
      const res = await axios.post("http://localhost:3000/add", payload);
      alert(res.data.message);
    } catch (err) {
      console.log("Error in sending book to backend", err.message);
    }
  }

  function handleCollectionClick(name, formElement) {
    hiddenInputRef.current.value = name; // set collection_name
    formElement.requestSubmit(); // submit form programmatically
  }

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img
        src={props.image || "https://via.placeholder.com/150x200?text=No+Cover"}
        className="card-img-top"
        alt="book cover"
      />
      <div className="card-body">
        <h5 className="card-title">{props.title || "No Title"}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Author: {props.author || "Unknown"}</li>
        <li className="list-group-item">First Published: {props.year || "N/A"}</li>
      </ul>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="cover_i" value={props.cover_i} />
          <input type="hidden" name="title" value={props.title} />
          <input type="hidden" name="author" value={props.author} />
          <input type="hidden" name="publish_year" value={props.year} />
          <input type="hidden" name="collection_name" ref={hiddenInputRef} />

          <div className="dropup"> {/* dropup instead of dropdown */}
            <button
              className="btn btn-primary dropdown-toggle rounded-pill px-3 my-2"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Add to Collection
            </button>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {userCollection.map((collection, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={(e) =>
                      handleCollectionClick(collection.name, e.target.form)
                    }
                  >
                    {collection.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cards;
