import { Router } from "express";
import passport from "passport";
import userModel from '../models/user.model.js';

import isAdmin from '../middlewares/isAdmin.js';

const router = Router();

router.post('/login', isAdmin, passport.authenticate("login", { failureRedirect: '/loginfailed '}), async (req, res) => {
    if (!req.user){
        return res.status(500).json({message: 'User not found'})
    }

    req.session.user = {
        firstName : req.user.firstName,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    res.status(200).redirect('/products')
})

router.get('/loginfailed', (req, res) => {
    res.status(401).json({message: 'Login failed'})
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureredirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.post("/register", passport.authenticate("register", { failureRedirect: '/session/failRegister' }), async (req, res) => {
    return res.status(201).redirect('/login');
});

router.get('/failRegister', (req, res) => {
    res.status(400).json({ message: 'Fail Register' });
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

/*router.post('/login', isAdmin, async (req, res) => {
    
        res.status(200).redirect('/products')

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/register', async (req, res) => {
    const { firstName, email, age, password } = req.body;

    console.log(req.body)

    if(!firstName || !email || !age || !password){
        return res.status(400).json({message: 'Missing required fields'});
    }
    
    try {
        const user = await userModel.create({firstName, email, age, password})
        res.status(200).redirect('/login');
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

*/

export default router;