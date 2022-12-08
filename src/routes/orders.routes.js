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
    getOne(req, res, next) { //B

        try{
            const retrieveOptions = {};
            if(req.query.embed && req.query.embed === 'customer'){
                retrieveOptions.customer = true;
            }

            const idCustomer = req.query.idCustomer;
            
        }catch(err){
            return next(err);
        }

    }
    
}

new OrdersRoutes();

export default router;