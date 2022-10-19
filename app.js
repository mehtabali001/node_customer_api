const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();

// DB Config
const db = require('./keys').mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true,useFindAndModify: false}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Static Middleware 

// Express body parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));


// Method override
//app.use(methodOverride('_method'));





app.use(cors({
  origin:true,
  headers: { 
     "Access-Control-Allow-Origin": '*',
     'Content-Type': 'application/json, application/x-www-form-urlencoded, multipart/form-data',
     'Access-Control-Allow-Methods': 'DELETE, PUT, GET, POST',
     "Access-Control-Allow-Headers": "Authorization, Origin, X-Requested-With, Content-Type, Accept",
    } 
}));

// Routes
//app.use('/', require('./routes/index.js'));
app.use('/api/v1', require('./routes/Apis.js'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
