const express = require('express');
const path = require('path');

const fs = require('fs');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const contact = require('./models/contact')
const cookieParser = require('cookie-parser');
const { hash } = require('crypto');
const { request } = require('http');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


//  Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Modules page
app.get('/modules', (req, res) => {
    res.render('modules'); 
});

//For About
app.get('/about',(req,res)=>{
    res.render('about');
})


//For Register

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user= await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.send("⚠️ User with this username or email already exists.");
        }

        //const hashedPassword = await bcrypt.hash(password, 10);
        bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(password,salt,async (err,hash)=>{
            let user= await User.create({
                username,
                email,
                password:hash
            });
            
            let token=jwt.sign({email:email,userid:user._id},'atul');
           res.cookie('token',token);
            
            res.redirect('/login');

           })
        })
        //const user = new User({ username, email, password: hashedPassword });
        // await User.save();
       //console.log(hashedPassword);
       

    } catch (err) {
        console.error(err);
        res.send("🚫 Server error. Please try again.");
    }
});


//FOr login page
app.get('/login',(req,res)=>{
    res.render('login');

})

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { username, password,email} = req.body;
    const user = await User.findOne({
            $and: [{ email }, { username }]
        });

    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Incorrect password");

    const token = jwt.sign({email:email, userid: user._id},'atul');
    //console.log("Generated JWT:", token);


   res.cookie('token', token, {
  httpOnly: true,     // Not accessible via client-side JS
  secure: false,       // Only sent over HTTPS
  sameSite: 'strict', // Prevents CSRF
  maxAge: 24 * 60 * 60 * 1000
});

   // res.send(` Welcome, ${user.username}`);
   res.render('index');
});

//For logout
app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/login');
})
//job Search
app.get('/jobs',(req,res)=>{
     res.render('jobsearch');
});
app.get('/email',(req,res)=>{
res.render('email');
});
//Route for Cyber Security
app.get('/security',(req,res)=>{
    res.render('cyber');
});
//Route for Banking And UPI
app.get('/upi',(req,res)=>{
res.render('banking');
});
//Route For Google and Youtube
app.get('/google',(req,res)=>{
    res.render('googleAndyoutube');

});
//QUIZ
app.get('/quiz',(req,res)=>{
    res.render('quiz');
});
app.get('/contact',(req,res)=>{
    res.render('contact');

});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new contact({
      name,
      email,
      message
    });

    await newMessage.save();
    res.send("Thank you! Your message has been sent.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong. Try again later.");
  }
});

//for Feedback
app.get('/feedback',(req,res)=>{
    res.render('feedback');
})

app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  const feedback = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n---\n`;

  const feedbackFolder = path.join(__dirname, 'Feedback');
  const feedbackFile = path.join(feedbackFolder, 'feedback.txt');

  // Create folder if it doesn't exist
  if (!fs.existsSync(feedbackFolder)) {
    fs.mkdirSync(feedbackFolder);
  }

  // Append feedback to the file
  fs.appendFile(feedbackFile, feedback, (err) => {
    if (err) {
      console.error('Error writing feedback:', err);
      return res.status(500).send('Failed to save feedback.');
    }
    res.send('Thank you for your feedback!');
  });
});

//for viewing Feedback

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // for CSS, JS, HTML
const feedbackFile = path.join(__dirname, 'Feedback', 'feedback.txt');
app.get('/view_feedback', (req, res) => {
  fs.readFile(feedbackFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading feedback file:', err);
      return res.status(500).json({ error: 'Could not load feedback.' });
    }

    // Split entries by separator and remove empty entries
    const feedbackEntries = data
      .split('---\n')
      .filter(entry => entry.trim())
      .map(entry => entry.trim());

    res.json({ feedback: feedbackEntries });
  });
});

// Start server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
