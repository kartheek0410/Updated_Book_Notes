import React from 'react';
import axios from 'axios';
import  {useNavigate} from 'react-router-dom';

axios.defaults.withCredentials = true;

function Auth(props) {
  
  const navigate = useNavigate();
    
  const [user ,setUser]  = React.useState({ name : "" , email : "", password : "" });

    function handleUser(event){
        const {name ,value} = event.target;

        setUser((prev)=>{
            return {
            ...prev,
            [name] : value,
        }});

    }

 async  function handleSubmit(event){
        event.preventDefault();
        const endpoint = props.isLogin ? "http://localhost:3000/users/login" : "http://localhost:3000/users/register";
        const payload = props.isLogin ? {email: user.email ,password : user.password} : user;

        try{
            const res = await axios.post(endpoint , payload);

            if(res.data.redirect){
                props.loginhandle();
                navigate(res.data.redirect);
            }else{
                alert(res.data);
            }
        }catch(err){
            console.log("error in sending user detail to backend ",err);
        }

    }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">
        Welcome to <span className="text-primary">BOOK NOTES</span>
      </h1>

      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="h4 mb-3  fw-normal text-center">
          {props.isLogin ? "Login your account" : "Create your account"}
        </h2>

        {/* Show Full Name only for Register */}
        {!props.isLogin && (
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="fullname"
              placeholder="Full Name"
              name="name"
              onChange={handleUser}
              value={user.name}
            />
            <label htmlFor="fullname">Full Name</label>
          </div>
        )}

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            name="email"
            onChange={handleUser}
            value={user.email}
          />
          <label htmlFor="email">Email Address</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            name="password"
            onChange={handleUser}
            value={user.password}
          />
          <label htmlFor="password">Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2 mb-3" type="submit">
          {props.isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
