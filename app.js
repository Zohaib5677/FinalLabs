// app.js
const express = require('express');
const mongoose = require('mongoose');
const attractionsRouter = require('./routes/attractions');
const visitorsRouter = require('./routes/visitors');
const reviewsRouter = require('./routes/reviews');

const app = express();

mongoose.connect('mongodb://localhost/tourism-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Routes
app.use('/api/attractions', attractionsRouter);
app.use('/api/visitors', visitorsRouter);
app.use('/api/reviews', reviewsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  // Fixed template literal syntax
});
