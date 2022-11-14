import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "./handlers/users";
import productRoutes from "./handlers/products";
import {authentication} from "./middlewares/authentication";

const app: express.Application = express();
const port: number = 6060;

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Welcome to Shopping Cart API!!');
})

userRoutes(app);
productRoutes(app);

app.listen(port, () => {
    console.log('server started on port: ' + port);
});

export default app;
