import React from 'react';
import axios from 'axios';
import { useNavigate ,Link } from 'react-router-dom';
axios.defaults.withCredentials = true;
function Header(props) {

  
  const [query,setQuery]= React.useState("");
  const navigate = useNavigate();

  function handleQuery(event){
    setQuery(event.target.value);
  }
  
  async function searchSubmit(event){
    event.preventDefault();
    const payload = {query: query};
    

    try{
      const res = await axios.post("http://localhost:3000/searchbooks", payload );
      setQuery("");

      if(res.data.redirect){
        navigate(res.data.redirect);
      }
      
      if(res.data.books){
        
        props.loadbooks(res.data.books);
        navigate("/searchbooks");
      } else {
        console.log("No books found in response:", res.data);
      }
    }catch(err){
      console.log("error in header searchbooks" , err.message);
    }
  }

  return (
    <header className="p-3 green-bg head_nav" style={{backgroundColor : "#B1DDF1"}}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </Link>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center align-items-center mb-md-0">
            <li><Link to="/" className="nav-link px-3 text-black">Home</Link></li>
            <li><Link to="/mycollection" className="nav-link px-3 text-black">My Collection</Link></li>
            <form onSubmit={searchSubmit}>
              <input
                type="text"
                onChange={handleQuery}
                name="query"
                placeholder="Author/Title"
                className="btn btn-light rounded-pill px-3"
                value={query}
              />
              <input
                type="submit"
                value="<Search Book"
                className="btn x rounded-pill px-3"
              />
            </form>

          </ul>

          <div className="text-end">
            <Link to={ props.islogged? "/" :"/login"}><button type="button" className="btn btn-outline-dark me-2" onClick={props.islogged? props.logouthandle: undefined}>{props.islogged?  "Logout" :"Login" }</button></Link>
            {!props.islogged && <Link to="/register"><button type="button" className="btn btn-warning">Sign-up</button></Link>}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;