import express from 'express';
import HttpError from 'http-errors';

const router = express.Router(); 

class PizzeriaRoutes {
    
    constructor() {
        router.get('/', this.getAll); //B
        router.get('/:idPizzeria', this.getOne); //A
        router.post('/', this.postOne); //C
    }

    getAll(req, res, next) {

    }

    getOne(req, res, next) {

    }

    postOne(req, res, next) {

    }
}

new PizzeriaRoutes();

export default router;