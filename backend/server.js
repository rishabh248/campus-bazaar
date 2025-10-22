const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const http = require('http');
const { Server } = require('socket.io');

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const interestRoutes = require('./routes/interestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();

const app = express();

// V-- THIS IS THE FIX --V
// Trust the first proxy in front of the app (e.g., Render's load balancer)
app.set('trust proxy', 1);

// --- Middleware ---
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());


// --- API Routes ---
app.get('/api', (req, res) => res.json({ message: 'Welcome to Campus Bazaar API' }));
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app); 

const io = new Server(server, { 
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 A user connected to Socket.IO');

  socket.on('setup', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('new message', async (newMessage) => {
    const { conversationId, senderId, content } = newMessage;
    try {
      let msg = await Message.create({ conversation: conversationId, sender: senderId, content: content });
      msg = await msg.populate('sender', 'name');
      msg = await msg.populate({ path: 'conversation', populate: { path: 'participants', select: 'name' } });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: msg._id });

      msg.conversation.participants.forEach((user) => {
        if (user._id.toString() === senderId) return;
        io.to(user._id.toString()).emit('message received', msg);
      });
    } catch (error) {
      console.error('Error handling new message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});