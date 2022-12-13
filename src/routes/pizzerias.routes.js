import e from 'express';
import express from 'express';
import HttpError from 'http-errors';
import pizzeriaRepository from '../repositories/pizzeria.repository.js';
import pizzeriaValidator from '../validators/pizzeria.validator.js';

const router = express.Router();

class PizzeriaRoutes {

    constructor() {
        router.get('/', this.getAll); //B
        router.get('/:idPizzeria', this.getOne); //A
        router.post('/', this.postOne); //C
    }

    async getAll(req, res, next) { //B
        try {
            const retrieveOptions = {
                limit: req.query.limit,
                page: req.query.page,
                speciality: req.query.speciality
            }

            let [pizzeria, itemCount] = await pizzeriaRepository.retrieve(retrieveOptions);

            pizzeria = pizzeria.map(p => {
                p = p.toObject({ getters: false, virtuals: false });
                p = pizzeriaRepository.transform(e);

                return e;
            })

            // TODO: Continuer

            res.status(200);
        }
        catch (err) {
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
                pizzeria = pizzeriaRepository.transform(pizzeria);
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
        const newPizzeria = req.body;

        if (Object.keys(newPizzeria).length === 0) {
            return next(HttpError[204]("La pizzeria ne peut pas contenir aucune donnée"));
        }

        try {
            let pizzeriaToAdd = await pizzeriaRepository.create(newPizzeria);
            pizzeriaToAdd = pizzeriaToAdd.toObject({ getters: false, virtual: false });
            pizzeriaToAdd = pizzeriaRepository.transform(pizzeriaToAdd);

            res.status(201).json(pizzeriaToAdd);
        } catch (err) {
            return next(err);
        }
    }
}

new PizzeriaRoutes();
export default router;