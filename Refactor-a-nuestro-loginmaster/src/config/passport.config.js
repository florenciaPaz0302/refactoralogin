import { createHash, isValidPassword } from "../utils.js";

import GitHubStrategy from "passport-github2"
import passport from "passport";
import passportLocal from "passport-local"
import userModel from "../models/user.model.js";

//Estrategia local
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {

    //Estrategia de login con Github
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'SuIDCliente', 
            clientSecret: 'SuClaveCliente',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ");
            console.log(profile);
            try {
                const user = await userModel.findOne({email: profile._json.email});
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    //Si entramos por acá significa que el usuario ya existía.
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        })
    )

    //Estrategia de registro
    passport.use("register", new localStrategy(
        {passReqToCallback: true, usernameField: "email"} , async (req, username, password, done) => {
            const {first_name , last_name , email, age , role} = req.body

            try {
                const exists = await userModel.findOne({email});
                console.log(exists);
                if (exists){
                    console.log("El usuario no existe");
                    done(null,false)
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role
                };
                const result = await userModel.create(user);
                return done(null, result)
            } catch (error) {
                return done("Error registrando el usuario: " + error)
            }
        }
    ));

    //Estrategia de login
    passport.use("login" , new localStrategy({usernameField: "email"}, async(username, password, done) => {
        try {
            const user = await userModel.findOne({email:username});
            if (!user) {
                console.log("User doesn't exists");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
    ));

    
    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }

    });

};


export default initializePassport;