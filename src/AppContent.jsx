import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from './components/header.jsx'; 
import Footer from './components/footer.jsx'; 
import Home from './pages/home.jsx';
import Auth from './pages/auth.jsx';
import MyCollection from  './pages/mycollection.jsx'
import SearchBooks from './pages/searchbooks.jsx';
import Notes from './pages/note.jsx';
import './App.css';
import axios from 'axios';

function AppContent() {
  const location = useLocation();

  const [searchbooks,setBooks] = React.useState([]);
  function handleSearch(books){
    setBooks(books);
  }

const [islogged , setLogged] = React.useState(false);
React.useEffect(() => {
  axios.get("http://localhost:3000/check-session")
    .then(res => setLogged(res.data.loggedIn))
    .catch(() => setLogged(false));
}, []);


function handlelogin() {
  setLogged(true);
}

async function handlelogout(){
  setLogged(false);
  try{
    const res = await axios.post("/logout");
    alert(res.data.message);
   
  }catch(err){
    console.log("error in logout",err.message);
  }
}
 


  const hideLayout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">

    
      {!hideLayout && <Header loadbooks ={handleSearch}  logouthandle={handlelogout}   islogged={islogged}/>}
        <div className='content'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth isLogin={true} loginhandle = {handlelogin}/>} />
        <Route path="/register" element={<Auth isLogin={false}  loginhandle = {handlelogin}/>} />
        <Route path= "/searchbooks" element ={islogged? <SearchBooks books={searchbooks}/>: <Home/>}/>
        <Route path= "/mycollection" element ={islogged? <MyCollection />: <Home/>}/>
        <Route path= "/notes/:id" element={islogged ? <Notes />: <Home/>}/>
      </Routes>
      </div>
      <Footer className ="foo"/>
      
    </div>
  );
}



export default AppContent;
