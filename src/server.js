const express = require('express');
const mongo = require('mongoose');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const mediaRouter = require('./routes/media');
const cors = require('cors');
const cartRouter = require('./routes/cart');
const wishListRouter = require('./routes/wishlist');
const Auth = require('./middlewares/auth.middleware');
const userRouter = require('./routes/user');
const AllowAnonymous = require('./middlewares/allow-anonymous.middleware');
const faqRouter = require('./routes/faq');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

mongo.connect(process.env.MONGO_URL).then(() => console.log('Connected to DB'));

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);
app.use(compression());

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

app.use(limiter);

app.use(AllowAnonymous);

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/media', mediaRouter);
app.use('/faq', faqRouter);

app.use(Auth);

app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishListRouter);

app.listen(process.env.PORT, () =>
  console.log(`Listening to port ${process.env.PORT}`)
);
