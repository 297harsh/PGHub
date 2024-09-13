const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const UserModel = require("../models/usersInfoModel");

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope:["profile","email"],
    },
    async (accessToken, refreshToken, profile, callback) => {
        try {
            const existingUser = await UserModel.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });

            if (existingUser) {
                existingUser.googleId = profile.id;
                existingUser.userName = profile.displayName;
                existingUser.email = profile.emails[0].value;
                existingUser.profilePicture = profile.photos[0].value;
                
                await existingUser.save();
                callback(null, existingUser);
            } 
            else {
                const newUser = new UserModel({
                    googleId: profile.id,
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: "google",
                    profilePicture: profile.photos[0].value,
                    email_verified: true,
                });
                await newUser.save();
                callback(null, newUser);
            }
        } 
        catch (error) {
            console.error('Error in Google Strategy:', error);
            callback(error, null);
        }
    }
));

passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
        try {
            const existingUser = await UserModel.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] });
    
            if (existingUser) {
                existingUser.facebookId = profile.id;
                existingUser.userName = profile.displayName;
                existingUser.email = profile.emails[0].value;
                existingUser.profilePicture = profile.photos[0].value;
                // existingUser.email_verified = true;
                await existingUser.save();
    
                return callback(null, existingUser);
            } 
            else {
                const newUser = new UserModel({
                    facebookId: profile.id,
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: "facebook",
                    profilePicture: profile.photos[0].value,
                    email_verified: true,
                });
                await newUser.save();
                return callback(null, newUser);
            }
        } 
        catch (error) {
            console.error("Error in Facebook Auth Strategy:", error);
            return callback(error, null);
        }
      }
    )
  );

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } 
    catch (err) {
        done(err, null);
    }
});
