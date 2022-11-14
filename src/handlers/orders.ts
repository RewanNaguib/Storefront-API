import express, {Request, Response} from "express";
import {OrderType, OrderProductType, Order} from "../models/order";
import {authentication} from "../middlewares/authentication";

const order = new Order();

const index = async(req: Request, res: Response) => {
    try{
        const orders: OrderType[] = await order.index();
        res.json(orders);
    } catch(error){
        res.status(500).json((error as Error).message);
    }  
};

const show = async(req: Request, res: Response) => {
    const id: string = req.params.id;
    if(id){
        try{
            const thisOrder: OrderType = await order.show(id);
            if(thisOrder){
                res.json(thisOrder);
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

const getUserOrders = async(req: Request, res: Response) => {
        const userId: string = req.params.id;
        if(userId){
            try{
                const orders: OrderType[] = await order.getUserOrders(userId);
                res.json(orders);
            } catch(error){
                res.sendStatus(500);
            }
        }
        else{
            res.sendStatus(400);
        }
};

const getOrderDetails = async(req: Request, res: Response) => {
    const orderId: string = req.params.id;
    if(orderId){
        try{
            const orderDetails: OrderProductType[] = await order.getOrderDetails(orderId);
            res.json(orderDetails);
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
};

const getUserClosedOrders = async(req: Request, res: Response) => {
    const userId: string = req.params.id;
    if(userId){
        try{
            const closedOrders: OrderType[] = await order.getUserClosedOrders(userId);
            res.json(closedOrders);
        } catch(error){
            res.sendStatus(500);
        }
    }
    else{
        res.sendStatus(400);
    }
};

const create = async(req: Request, res: Response) => {
    const id: string = req.params.id;
    const userId: number = parseInt(id);
    if(id){
        try{
            if(userId && typeof userId == 'number'){
                const newOrder: OrderType = await order.create(id, userId);
                res.json(newOrder);
            }
            else{
                res.sendStatus(400);
            }
        } catch(error){
            res.sendStatus(404);
        }
    }
    else{
        res.sendStatus(400);
    }

};

const addProductToOrder = async(req: Request, res: Response) => {
    const orderId: string = req.params.id;
    const productId: number = req.body.productId;
    const quantity : number = req.body.quantity;

    if(orderId){
        try{
            if(quantity && typeof quantity == 'number' && quantity > 0 && productId && typeof productId == 'number'){
                const addedProductToOrder: OrderProductType = await order.addProductToOrder(quantity, orderId, productId);
                res.json(addedProductToOrder);
            }
            else{
                res.sendStatus(400);
            }
        } catch(error){
            res.status(404).json((error as Error).message);
        }
    }
    else{
        res.sendStatus(400);
    }

};

const updateOrderStatusToClosed = async(req: Request, res: Response) => {
    const orderId: string = req.params.id;
    if(orderId){
        try{
                const updatedOrderStatusToClosed: OrderType = await order.updateOrderStatusToClosed(orderId);
                res.json(updatedOrderStatusToClosed);
        } catch(error){
            res.sendStatus(404);
        }
    }
    else{
        res.sendStatus(404);
    }
};


const orderRoutes = (app: express.Application): void => {
    app.get('/orders', authentication, index);
    app.get('/orders/:id', authentication, show);
    app.get('/users/:id/orders', authentication, getUserOrders);
    app.get('/order-details/:id', authentication, getOrderDetails); 
    app.get('/users/:id/closed-orders', authentication, getUserClosedOrders);
    app.patch('/closed-order/:id', authentication, updateOrderStatusToClosed);
    app.post('/users/:id/orders', authentication, create);
    app.post('/add-products/orders/:id', authentication, addProductToOrder);
};

export default orderRoutes;
