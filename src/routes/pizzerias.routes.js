import e from 'express';
import express from 'express';
import HttpError from 'http-errors';
import pizzeriaRepository from '../repositories/pizzeria.repository.js';

const router = express.Router();

class PizzeriaRoutes {

    constructor() {
        router.get('/', this.getAll); //B
        router.get('/:idPizzeria', this.getOne); //A
        router.post('/', this.postOne); //C
    }

    async getAll(req, res, next) { //B
        try{
            const retrieveOptions={
                limit:req.query.limit,
                page:req.query.page,
                speciality:req.query.speciality
            }

            let [pizzeria, itemCount] = await pizzeriaRepository.retrieve(retrieveOptions);

            pizzeria = pizzeria.map(p=>{
                p = p.toObject({getters:false, virtuals:false});
                p = pizzeriaRepository.transform(e);

                return e;
            
            })

            // TODO: Continuer

            res.status(200);

        }

        catch(err){
            return next(HttpError.InternalServerError());
        }
    }

    async getOne(req, res, next) { //A -- Fonctionne
        const idPizzeria = req.params.idPizzeria;
        const retrieveOptions = {}

        if (req.query.embed) {
            if (req.query.embed === 'orders') {
                retrieveOptions.orders = true;
            }
        }

        try {
            let pizzeria = await pizzeriaRepository.retrieveById(idPizzeria, retrieveOptions);

            if (pizzeria) {
                pizzeria = pizzeria.toObject({ getters: false, virtuals: true });
                res.status(200).json(pizzeria);
            }
            else {
                return next(HttpError.NotFound(`La pizzeria avec l'id ${idPizzeria} n'existe pas`));
            }
        } catch (err) {
            return next(err);
        }
    }

    async postOne(req, res, next) { //C
        try {

            let newPizzeria = await pizzeriaRepository.create(req.body);

            newPizzeria.toObject({ getters: false, virtuals: true });

            res.status(201).json(newPizzeria);
        } catch (err) {
            return next(err);
        }
    }
}

new PizzeriaRoutes();

export default router;