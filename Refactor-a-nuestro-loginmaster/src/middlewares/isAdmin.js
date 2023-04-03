const  admin = {
    user: "adminCoder@coder.com",
    password: "adminCod3r123",
    firstName: 'admin',
    role: "admin"
}

const isAdmin = (req, res, next) => {
    const { email, password } = req.body;

    try {
        if(email == admin.user && password == admin.password){
            let user = {...admin}
            user['password'] = undefined;
            req.session.user = user;
            res.status(200).redirect('/products')
        }else{
            next();
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export default isAdmin;