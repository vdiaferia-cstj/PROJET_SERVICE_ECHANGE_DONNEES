import express from 'express';
import HttpError from 'http-errors';

const router = express.Router(); 

class OrdersRoutes {
    
    constructor() {
        router.get('/', this.getAll); //C
        router.get('/:idPizzeria/orders/:idOrder', this.getOne); //B
        
    }

    getAll(req, res, next) {

    }
    getOne(req, res, next) {

    }
    
}

new OrdersRoutes();

export default router;