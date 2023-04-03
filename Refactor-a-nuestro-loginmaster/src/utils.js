import bcrypt from "bcrypt";
import {dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user , password) => {
    console.log(`Validar user-password: ${user.password}, password: ${user.password}`);
    return bcrypt.compareSync(password , user.password)
}

export default __dirname;