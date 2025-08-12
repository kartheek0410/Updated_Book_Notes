import express, {json} from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
import bcrypt from 'bcrypt';
import cors from 'cors';
import pgSession from 'connect-pg-simple';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

const db = new pg.Client({
    host :  process.env.DB_HOST,
    port : 5432 ,
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
});

try {
  await db.connect();
  console.log("✅ Connected to PostgreSQL database.");
} catch (err) {
  console.error("❌ Failed to connect to the database:", err.message);
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // replace with your frontend URL
  credentials: true
}));

app.use(session({
  store: new (pgSession(session))({
    pool: db, // Reuse existing PG pool
    createTableIfMissing: true
  }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.post("/users/register" , async(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password  = req.body.password;
    // console.log(name);
    try{
        const checkResult  = await db.query("select * from users where email= $1" , [email]);

        if(checkResult.rows.length>0){
            res.send("Email already exists. Try logging  in");
        }else{
           bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Failed to hash password" });
                }

                await db.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3)", [name, email, hash]);
                req.session.userEmail = email;
                res.status(200).json({ redirect: "/" });
            });

        }
    }catch(err){
        console.log("Error in register route:", err.message);

    }
});

app.post("/users/login",async (req,res)=>{
    const email = req.body.email;
    const password  = req.body.password;
    try{
        const checkResult  = await db.query("select * from users where email=$1",[email]);
        const user = checkResult.rows[0];
        if (checkResult.rows.length === 0) {
            return res.status(404).send("User not found");
        }else{
            bcrypt.compare(password , user.password , (err,same)=>{
                if(same){
                    req.session.userEmail = email;
                    res.status(200).json({ redirect: "/" });
                    
                }else{
                    res.status(400).send("Incorrect Password");
                }
            });
        }
    }catch(err){
        console.log("Error in login route:", err.message);
    }
});

app.get("/check-session", (req, res) => {
  if (req.session.userEmail) {
    res.status(200).json({ loggedIn: true, email: req.session.userEmail });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});


app.post("/searchbooks", async (req, res) => {
    if(!req.session.userEmail){
        res.status(400).json({redirect : "/login"});
        
    }else{

        const q = req.body.query;
        try {
            const result = await axios.get(`https://openlibrary.org/search.json?q=${q}`); 
            res.status(200).json({books : result.data.docs}); 
        } catch (error) {
            console.error("Error fetching books:", error.message);
            res.status(500).json({ error: "Failed to fetch books" });
        }
    }
});
app.get("/getcollection", async (req, res) => {
  const email = req.session.userEmail;

    if (!email) {
        return res.status(401).json({ error: "Not logged in" });
    }

        try {
            const result = await db.query("SELECT name FROM collections WHERE email = $1", [email]);
            res.status(200).json({ collection: result.rows });
        } catch (err) {
            console.log("Error in getcollection:", err.message);
            res.status(500).json({ error: "Failed to get collections" });
        }
    
});
app.post("/newcollection", async (req, res) => {
  const email = req.session.userEmail;
  const { collection } = req.body;


  if (!email) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    await db.query("INSERT INTO collections(email, name) VALUES($1, $2)", [email, collection]);
    res.status(200).json({ redirect: "/mycollection" });
  } catch (err) {
    console.log("Error inserting into collections:", err.message);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.post("/add", async (req, res) => {
  const { cover_i, title, author, publish_year, collection_name } = req.body;
  const email = req.session.userEmail;
  // console.log(cover_i, title, author, publish_year, collection_name);

  if (!email) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    await db.query(
      `INSERT INTO books 
       (email, title, publish_year, author, collection_name, cover_i) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, title, publish_year, author, collection_name, cover_i]
    );
    // console.log("added");
    res.status(200).json({ message: "Book added successfully" });
  } catch (err) {
    console.error("Error inserting book:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
});

app.get("/book", async (req, res) => {
  const { id } = req.query; // ✅ use req.query

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1 and email=$2", [id,req.session.userEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ book: result.rows[0] });
  } catch (err) {
    console.log("Error fetching the book from DB:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/getbooks", async (req, res) => {
  const email = req.session.userEmail;
  const collection_name = req.body.collection_name;

  try {
    const result = await db.query(
      "SELECT * FROM books WHERE email = $1 AND collection_name = $2",
      [email, collection_name]
    );
    res.status(200).json({ books: result.rows });
  } catch (err) {
    console.log("error in backend getbooks route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/savenotes", async (req, res) => {
  const { id, note } = req.body;

  try {
    const result = await db.query(
      "UPDATE books SET notes = $1 WHERE id = $2 AND email = $3",
      [note, id, req.session.userEmail]
    );

    res.status(200).json({ redirect: `/notes/${id}` });
  } catch (err) {
    console.error("Error saving note:", err.message);
    res.status(500).json({ error: "Failed to save note" });
  }
});

app.post("/book/delete", async (req, res) => {
  const id = req.body.id;

  try {
    const result = await db.query("DELETE FROM books WHERE id = $1 and email=$2", [id,req.session.userEmail]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    // console.log("deleted");
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // optional
    res.status(200).json({ message: "Logged out" , redirect:"/"});
  
  });
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
