import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/mycollection.css';
import BookCard from '../components/bookcard';

axios.defaults.withCredentials = true;

function MyCollection() {


  const [collection, setCollection] = React.useState("");
  const [collections, setCollections] = React.useState([]);

  const navigate = useNavigate();

  

  // Fetch collections on component mount
  React.useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      const res = await axios.get("http://localhost:3000/getcollection");
      setCollections(res.data.collection);

    } catch (err) {
      console.log("Error loading collections", err.message);
    }
  }

  function handleCollection(event) {
    setCollection(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (collection.trim() !== "") {
      const payload = { collection };

      try {
        const res = await axios.post("http://localhost:3000/newcollection", payload);
        setCollection("");
        setBooks([]);
        fetchCollections();

        if (res.data.redirect) {
          navigate(res.data.redirect);
        } else {
          console.log("Unexpected response from backend:", res.data);
        }
      } catch (err) {
        console.log("Error in adding collection", err.message);
      }
    }
  }
  const [books , setBooks] = React.useState([]);

  async function handleCollectionClick(name) {
    console.log("Clicked collection:", name);
    const payload = {collection_name: name};
    try{
      const result = await axios.post("http://localhost:3000/getbooks",payload);
      setBooks(result.data.books);
    
    }catch(err){
      console.log("error in getting books in the collection frontend",err.message);
    }
  }
  React.useEffect(() => {
    console.log("Books updated:", books);
  }, [books]);

  

  async function handleDelete(id){
     try{
      const result = await axios.post("http://localhost:3000/book/delete", { id: id });
      console.log("Deleted successfully", result.data);
      setBooks((prev)=>{
        return prev.filter((item)=>{
          return item.id!=id;
        });
      });

    }catch(err){
        console.log("error in deleting the book frontend" , err.message);
    }
  }

  
  return (
    <div className="boxx">
      <div className="d-flex flex-column flex-shrink-0 p-3 sidebar">
        <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <svg className="bi pe-none me-2" width="40" height="32" aria-hidden="true">
            <use xlinkHref="#bootstrap" />
          </svg>
          <span className="fs-4">My Collection</span>
        </Link>

        <hr />

        {/* ✅ Corrected UL for collections */}
        <ul className="nav nav-pills flex-column mb-auto" >
          {collections.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                className="nav-link text-black bg-transparent border-0"
                style={{ cursor: "pointer", textAlign: "left" }}
                onClick={() => handleCollectionClick(item.name)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        <hr />

        {/* ✅ New Collection Form */}
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            name="collection"
            onChange={handleCollection}
            placeholder="New Collection"
            className="form-control mb-2 rounded-pill"
            value={collection}
          />
          <input
            type="submit"
            value="Add Collection"
            className="btn btn-light rounded-pill px-5 mt-2"
          />
        </form>
      </div>

      <div className="books p-4">
        {/* You can add display logic for selected collection here later */}
         <h2>{books.length > 0 ? books[0].collection_name : "Select a collection"}</h2>

         <div className="box d-flex flex-wrap gap-3">
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} deletebook ={handleDelete} />
            ))}
          </div>
      </div>
    </div>
  );
}

export default MyCollection;
