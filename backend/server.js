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

// Import models for chat logic
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const interestRoutes = require('./routes/interestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();

const app = express();
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


// API Routes
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

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('🔌 A user connected to Socket.IO');

  // When a user connects, they join a room based on their own user ID
  socket.on('setup', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
    socket.emit('connected');
  });

  // When a user clicks on a chat, they join a room for that specific conversation
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  // When a user sends a new message
  socket.on('new message', async (newMessage) => {
    const { conversationId, senderId, content } = newMessage;

    try {
      // 1. Create and save the message to the database
      let msg = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content: content,
      });

      // 2. Populate the message with sender and conversation details
      msg = await msg.populate('sender', 'name');
      msg = await msg.populate({
        path: 'conversation',
        populate: { path: 'participants', select: 'name' },
      });
      
      // 3. Update the 'lastMessage' for the conversation
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: msg._id });

      // 4. Emit the message to all participants in the conversation room
      msg.conversation.participants.forEach((user) => {
        // Don't send the message back to the sender, they will add it to their UI instantly
        if (user._id.toString() === senderId) return;
        
        // Emit to the other participant's personal room
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