import express from 'express';
import HttpError from 'http-errors';
import pizzeriaRepository from '../repositories/pizzeria.repository.js';
import paginate from 'express-paginate';

const router = express.Router();

class PizzeriaRoutes {

    constructor() {
        router.get('/', /*paginate.middleware(25, 50),*/  this.getAll); //B
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

            let pizzeria = await pizzeriaRepository.retrieveAll();

            pizzeria = pizzeria.map(p=>{
                p = p.toObject({getters:false, virtuals:false});
               // p = pizzeriaRepository.transform(e);

                return p;
            
            })

            // const pageCount = Math.ceil(itemCount/ req.query.limit);
            // const hasNextPageFunction = paginate.hasNextPages(req);
            // const hasNextPage = hasNextPageFunction(pageCount);

            // const pagesLinksFunction = paginate.getArrayPages(req);
            // const links = pagesLinksFunction(3,pageCount, req.query.page);

            
            // const payload = {
            //     _metadata: {
            //         hasNextPage:hasNextPage, 
            //         page: req.query.page,
            //         limit: req.query.limit,
            //         skip: req.skip,
            //         totalPages: pageCount,
            //         totalDocuments: itemCount
            //     },
            //     _links: {
            //         prev:`${process.env.BASE_URL}${links[0].url}`,
            //         self:`${process.env.BASE_URL}${links[1].url}`,
            //         next:`${process.env.BASE_URL}${links[2].url}`

            //     }, data: explorations
            // }
            // if(req.query.page === 1) {
            //     payload._links.self = `${process.env.BASE_URL}${links[0].url}`;
            //     payload._links.next = `${process.env.BASE_URL}${links[1].url}`;
            //     delete payload._links.prev;
            // }

            // if(!hasNextPage) {
            //     payload._links.prev = `${process.env.BASE_URL}${links[1].url}`;
            //     payload._links.self = `${process.env.BASE_URL}${links[2].url}`;
            //     delete payload._links.next;
            // }

            res.status(200).json(pizzeria);

        }

        catch(err){
            return next(err);
        }
    }

    async getOne(req, res, next) { //A
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