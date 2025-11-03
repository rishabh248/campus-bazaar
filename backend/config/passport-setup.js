const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      if (!email.endsWith('@iiitdmj.ac.in')) {
        return done(new Error('Please use your IIITDMJ email (@iiitdmj.ac.in) to log in.'), null);
      }
      
      const rollNumberRegex = /^\d{2}(bec|bcs|bds|bme|bsm)\d{3}@iiitdmj\.ac\.in$/i;
      if (!rollNumberRegex.test(email)) {
           return done(new Error('Invalid IIITDMJ email format. Use format like 24bec103@iiitdmj.ac.in'), null);
      }

      try {
        let user = await User.findOne({ email: email });

        if (user) {
          return done(null, user);
        } else {
          const year = email.substring(0, 2);
          const branchCodeMatch = email.match(/^\d{2}([a-zA-Z]+)\d{3}/i);
          if (!branchCodeMatch) {
            return done(new Error('Could not parse branch from email.'), null);
          }
          const branchCode = branchCodeMatch[1].toUpperCase();
          let department = 'SM'; 
          if (branchCode === 'BEC') department = 'ECE';
          else if (branchCode === 'BCS') department = 'CSE';
          else if (branchCode === 'BME') department = 'ME';
          else if (branchCode === 'BDS') department = 'Design';
          
          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
          const role = adminEmails.includes(email) ? 'admin' : 'user';

          user = await User.create({
            name: name,
            email: email,
            password: `google_oauth_user_${Date.now()}`,
            phone: '0000000000', 
            batch: `20${year}`,
            department: department,
            role: role
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});