import express from 'express';
import HttpError from 'http-errors';
import pizzeriaRepository from '../repositories/pizzeria.repository.js';
import paginate from 'express-paginate';
import ordersRepositories from '../repositories/orders.repositories.js';


const router = express.Router();

class PizzeriaRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll); //B
        router.get('/:idPizzeria', this.getOne); //A
        router.post('/', this.postOne); //C
        router.get('/:idPizzeria/orders/:idOrder', this.getOne); //B

    }

    async getAll(req, res, next) { //B
        try {
            const retrieveOptions = {
                limit: req.query.limit,
                page: req.query.page,
                speciality: req.query.speciality
            }

            let [pizzeria, itemsCount] = await pizzeriaRepository.retrieveAll(retrieveOptions);

            pizzeria = pizzeria.map(p => {
                p = p.toObject({ getters: false, virtuals: false });
                p = pizzeriaRepository.transform(p);

                return p;
            })

            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);

            const pagesLinksFunction = paginate.getArrayPages(req);
            const links = pagesLinksFunction(3, pageCount, req.query.page);
            const payload = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: itemsCount
                },
                _links: {
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: `${process.env.BASE_URL}${links[2].url}`
                },
                data: pizzeria
            }

            if (req.query.page === 1) {
                payload._links.self = `${process.env.BASE_URL}${links[0].url}`;
                payload._links.next = `${process.env.BASE_URL}${links[1].url}`;
                delete payload._links.prev;
            }

            if (!hasNextPage) {
                payload._links.prev = `${process.env.BASE_URL}${links[1].url}`;
                payload._links.self = `${process.env.BASE_URL}${links[2].url}`;
                delete payload._links.next;
            }

            res.status(200).json(payload);
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
                pizzeria = pizzeriaRepository.transform(pizzeria, retrieveOptions);
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
            pizzeriaToAdd = pizzeriaToAdd.toObject({ getters: false, virtuals: false });
            pizzeriaToAdd = pizzeriaRepository.transform(pizzeriaToAdd);

            res.status(201).json(pizzeriaToAdd);
        } catch (err) {
            return next(err);
        }
    }

    async getOne(req, res, next) { //B

        const idPizzeria = req.params.idPizzeria;
        const idOrder = req.params.idOrder;
        const retrieveOptions={};


         try{
            let order = await ordersRepositories.retrieveOne(idOrder,idPizzeria,retrieveOptions);
            console.log(order);
            if(order){
                order = order[0].toObject({getters:false, virtuals:false});
                order = ordersRepositories.transform(order,retrieveOptions);
                res.status(200).json(order);
            }
            else{
                return next(HttpError.NotFound("L'order n'est pas trouve"));
            }
         }catch(err){
            return next(err);
         }
        

    }
}

new PizzeriaRoutes();
export default router;