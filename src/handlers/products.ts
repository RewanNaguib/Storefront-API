import express, {Request, Response} from "express";
import {ProductType, Product} from "../models/product";
import {authentication} from "../middlewares/authentication";

const product = new Product();

const index = async(req: Request, res: Response) => {
    try{
        const products: ProductType[] = await product.index();
        res.json(products);
    } catch(error){
        res.status(500).json((error as Error).message);
    }  
};

const show = async(req: Request, res: Response) => {
        const id: string = req.params.id;
        if(id){
            try{
                const thisProduct: ProductType = await product.show(id);
                if(thisProduct){
                    res.json(thisProduct);
                }
                else{
                    res.sendStatus(404);
                }
            } catch(error){
                res.sendStatus(500);
            }
        }
        else{
            res.sendStatus(400);
        }
};

const create = async(req: Request, res: Response) => {
    const productObject: ProductType = {
        productname: req.body.productname,
        productprice: req.body.productprice
    };
try{
    if(productObject && typeof productObject.productname == 'string' && productObject.productname.trim().length !== 0 && typeof productObject.productprice == 'number' && productObject.productprice !== undefined){
        const newProduct: ProductType = await product.create(productObject);
        res.json(newProduct);
    }
    else{
        res.sendStatus(400);
    }
} catch(error){
    res.status(400).json((error as Error).message);
}
};

const update = async(req: Request, res: Response) => {
    const id: string = req.params.id;
    const productObject: ProductType = {
        productname: req.body.productname,
        productprice: req.body.productprice
    };
    if(id){
        try{
            const updatedProduct: ProductType = await product.update(id, productObject.productname, productObject.productprice);
            if(updatedProduct){
                if(updatedProduct && typeof productObject.productname == 'string' && productObject.productname.trim().length !== 0 && typeof productObject.productprice == 'number' && productObject.productprice !== undefined){
                res.json(updatedProduct);
                }
                else{
                    res.sendStatus(400);
                }
            }
            else{
                res.sendStatus(404);
            }
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
};

const destroy = async(req: Request, res: Response) => {
    const id: string = req.params.id;
    if(id){
        try{
            const deletedProduct: number = await product.destroy(id);
            if(deletedProduct){
                res.status(204).json(deletedProduct);
            }
            else{
                res.sendStatus(404);
            }  
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
}


const productRoutes = (app: express.Application): void => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', authentication, create);
    app.patch('/products/:id', authentication ,update);
    app.delete('/products/:id', authentication, destroy);
};

export default productRoutes;
