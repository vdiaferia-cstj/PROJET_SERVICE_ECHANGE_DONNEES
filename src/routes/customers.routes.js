import express from 'express';
import HttpError from 'http-errors';

const router = express.Router(); 

class CustomerRoutes {
    
    constructor() {
        router.post('/', this.postOne); //B
        router.put('/:idCustomer', this.updateOne); //A
        router.get('/', this.getAll); //A
        router.get('/:idCustomer', this.getOne); //C
        
    }

    getAll(req, res, next) {

    }

    updateOne(req, res, next) {

    }

    postOne(req, res, next) {

    }

    getOne(req, res, next) {

    }
}

new CustomerRoutes();

export default router;