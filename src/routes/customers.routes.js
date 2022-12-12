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
        
            const retrieveOptions = {};
            if (req.query.planet) {
                    retrieveOptions.planet = req.query.planet;
            }
            retrieveOptions.limit = req.query.limit,
            retrieveOptions.skip = req.query.skip
            try {
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
                    totalPages: pageCount,
                    totalDocuments: itemsCount
                },
                _links: {
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: `${process.env.BASE_URL}${links[2].url}`
                },
                data: customers
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
        } catch (err) {
            return next(err)
        }
    }

   async updateOne(req, res, next) {//A
        try{
            const newCustomer = req.body;
            let customer = await customerRepository.update(req.params.idCustomer, newCustomer);
    
            if (!customer) {
                res.status(404).end();
                return next(HttpError.NotFound(`Le customer avec le id ${req.params.idCustomer} n'existe pas`));
            }
            customer = customer.toObject({getters:false, virtuals:false});
           // customer = customerRepository.transform(planet);
    
            if (req.query._body === 'false') {
                res.status(204).end();
                
            }
            
            res.status(200).json(customer);
          }catch (err){
            return next(err);
          }
    }

    postOne(req, res, next) {

    }

    getOne(req, res, next) {

    }
}

new CustomerRoutes();

export default router;