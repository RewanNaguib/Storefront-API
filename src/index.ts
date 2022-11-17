import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import { authentication } from './middlewares/authentication';

const app: express.Application = express();
const port: number = 7070;

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome to Shopping Cart API!!');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, () => {
  console.log('server started on port: ' + port);
});

export default app;
