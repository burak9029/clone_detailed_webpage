const express = require('express');
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());

//veritabani modeli

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// kayitetme noktasi end
app.post('/register', async(req,res) => {
    const{ email, password} = req.body;

    const hashedPassword = await brcypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword});

    await newUser.save();
    res.json({message: 'User registered successfully'});
});

//hesaba giris noktasi - endpoint

app.post('/login', async (req,res) =>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({error: 'User dont not found' });

    const isMatch = await brcypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({error: 'Invalid password'})

    const token = jwt.sign({ userId: user._id}, 'your-secret-key', {expiresIn: '1h'})
    res.json({ token });

});

//token i dogurlama

function authenticateToken(req,res,next) {
    const token = req.header('Authorization');
    if(!token) return res.sendStatus(403);
    req.user = user;
    next();
};

jwt.verify(token, 'your-secret-key', (err,user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
});


mongoose.connect('mongodb://locahost/auth-service', { userNewUrlParser: true, userUnifiedTopology: true })
.then(() => app.listen(3001, () => console.log('Auth service Runnging on port 3001')))