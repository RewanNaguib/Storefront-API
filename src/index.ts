import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';

const app: express.Application = express();
const port: number = 6060;

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log('server started on port: ' + port);
});

export default app;
