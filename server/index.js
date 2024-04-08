if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


const express = require("express");
const session = require('express-session');
const app = express();
const cors = require("cors");
const pool = require("./db");
const passport = require('passport');
const flash = require('express-flash')
const bcrypt = require('bcrypt');


/*initializePassport(passport, email) (
  passport,
  async email => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }
);
*/



//middleware
app.use(cors());
app.use(express.json()); // req.body

// USER SESSION
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input data here (e.g., check if username and password are not empty)

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id, email", // Return only non-sensitive data
      [email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Send back a generic error message
  }  
});

const rateLimit = require('express-rate-limit');

// Configure rate limit against brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 3, // Limit each IP to 5 login requests per windowMs
  message: 'For mange innloggingsforsøk fra denne IP-adressen, vennligst prøv igjen etter 15 minutter.'
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});


// User Login
/*app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data here (e.g., check if email and password are not empty)

    // Check if user exists in the database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]); // DETTE ER VELL IKKE SMART HVIS MAN HENTER ALLE EMAILS??
    const user = result.rows[0];

    if (user == null) {
      // If no user found with that email
      return res.status(400).send('Email eller passord er feil');
    }

    // Compare hashed password with the one in the database
    if (await bcrypt.compare(password, user.password)) {
      res.send('Success login'); // Login successful
    } else {
      res.status(400).send('Email eller passord er feil'); // Password does not match
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Send back a generic error message
  }
});*/


//ROUTES//

//Create Post
app.post("/vurdering", async(req,res) => {
  try {
      const { school_name, city, sted, passer, rate_plassering, rate_byggning, rate_badet, rate_kjokkenet, description_good, description_bad, bilder } = req.body;
      const newPost = await pool.query("INSERT INTO posts (school_name, city, sted, passer, rate_plassering, rate_byggning, rate_badet, rate_kjokkenet, description_good, description_bad, bilder) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [school_name, city, sted, passer, rate_plassering, rate_byggning, rate_badet, rate_kjokkenet, description_good, description_bad, bilder]
      );

      res.json(newPost.rows[0]);


  } catch (err) {
    console.error(err.message);
  }
})

// get all not approved posts
app.get("/admin/posts", async(req, res) => {
  try {
    const notApprovedPosts = await pool.query("SELECT * FROM posts WHERE approved = false");
    res.json(notApprovedPosts.rows);
  } catch (err) {
    console.error(err.message)
    
  }
})


//Accept Post
app.put("/admin/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatePost = await pool.query(
      "UPDATE posts SET approved = true WHERE post_id = $1 RETURNING *",
      [id]
    );

    if (updatePost.rowCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatePost.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// Delete post
app.delete("/admin/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await pool.query(
      "DELETE FROM posts WHERE post_id = $1 RETURNING *",
      [id]
    );

    if (deletePost.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted", post: deletePost.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// VURDERING SECTION

// SCHOOL DROPDOWN:
// Get schools by search term
// Get schools by search term
app.get("/vurdering/schools", async(req, res) => {
  try {
    const { term } = req.query;
    const matchingSchools = await pool.query(
      "SELECT * FROM universities WHERE university_name ILIKE $1",
      [`%${term}%`]
    );
    res.json(matchingSchools.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get cities by search term
app.get("/vurdering/cities", async(req, res) => {
  try {
    const { term } = req.query;
    const matchingCities = await pool.query(
      "SELECT * FROM cities WHERE city ILIKE $1",
      [`%${term}%`]
    );
    res.json(matchingCities.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// Get passer for
app.get("/vurdering/passerfor", async(req, res) => {
  try {
    const { term } = req.query;
    const matchingPasser = await pool.query(
      "SELECT * FROM Passerfor WHERE passer ILIKE $1",
      [`%${term}%`]
    );
    res.json(matchingPasser.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




// Get locations by city ID
app.get("/vurdering/locations", async (req, res) => {
  try {
    const { cityId } = req.query; // Expecting a city ID
    const matchingLocations = await pool.query(
      "SELECT * FROM locations WHERE city_id = $1",
      [cityId] // Use the city ID to filter locations
    );
    res.json(matchingLocations.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});





app.listen(5000, () => {
  console.log("server has started on port 5000");
});