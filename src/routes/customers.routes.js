import express from 'express';
import HttpError from 'http-errors';
import paginate from 'express-paginate';
import customerRepository from '../repositories/customer.repository.js';
import { PLANET_NAMES } from '../libs/constants.js';

const router = express.Router(); 

class CustomerRoutes {
    
    constructor() {
        router.post('/', this.postOne); //B
        router.put('/:idCustomer', this.updateOne); //A
        router.get('/', paginate.middleware(20, 40), this.getAll); //A
        router.get('/:idCustomer', this.getOne); //C
        
    }

   async getAll(req, res, next) {//A
        try {

            const retrieveOptions = {
                limit: req.query.limit,
                skip: req.query.skip
            }

            console.log(req.skip);

            let [customers, itemsCount] = await customerRepository.retrieve(retrieveOptions);

            customers = customers.map(c => {
                c = c.toObject({ getters: false, virtuals: false });
                return c;
            });

            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);

            const pagesLinksFunction = paginate.getArrayPages(req);
            const links = pagesLinksFunction(3, pageCount, req.query.page);
            console.log(links);

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
                    prev: `${process.env.DATABASE}${links[0].url}`,
                    self: `${process.env.DATABASE}${links[1].url}`,
                    next: `${process.env.DATABASE}${links[2].url}`
                },
                data: customers
            }

            if (req.query.page === 1) {
                //[0] => self
                //[1] => next
                //prev => delete
                payload._links.self = `${process.env.DATABASE}${links[0].url}`;
                payload._links.next = `${process.env.DATABASE}${links[1].url}`;
                delete payload._links.prev;
            }

            if (!hasNextPage) {
                //[0] 
                //[1] => prev
                //[2] => self
                //next => delete
                payload._links.prev = `${process.env.DATABASE}${links[1].url}`;
                payload._links.self = `${process.env.DATABASE}${links[2].url}`;
                delete payload._links.next;
                PLANET_NAMES;
            }

            res.status(200).json(payload);
        } catch (err) {
            return next(err)
        }
    }

    updateOne(req, res, next) {//A

    }

    postOne(req, res, next) {

    }

    getOne(req, res, next) {

    }
}

new CustomerRoutes();

export default router;