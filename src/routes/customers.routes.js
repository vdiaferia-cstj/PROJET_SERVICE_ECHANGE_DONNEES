import express from 'express';
import HttpError from 'http-errors';
import paginate from 'express-paginate';
import CustomerValidator from '../validators/customer.validator.js';
import validator from '../middlewares/validator.js';
import customerRepository from '../repositories/customer.repository.js';

const router = express.Router();

class CustomerRoutes {

    constructor() {
        router.post('/', this.postOne); //B
        router.put('/:idCustomer', CustomerValidator.complete(), validator, this.updateOne); //A
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
                c = customerRepository.transform(c);
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
        try {
            const newCustomer = req.body;
            let customer = await customerRepository.update(req.params.idCustomer, newCustomer);

            if (!customer) {
                return next(HttpError.NotFound(`Le customer avec le id ${req.params.idCustomer} n'existe pas`));
            }
            if (req.query._body === 'false') {
                res.status(204).end();
            }
            
            customer = customer.toObject({ getters: false, virtuals: false });
            customer = customerRepository.transform(customer);
            

            res.status(200).json(customer);

        } catch (err) {
            return next(err);
        }
    }

    async postOne(req, res, next) { // B
        const newCustomer = req.body;
        if (Object.keys(newCustomer).length === 0) {
            return next(HttpError.BadRequest('Le client contient aucune donnée'));
          }
        if(!newCustomer){
            return next(res.status(204));
        }
          try {
            let customeradded = await customerRepository.create(newCustomer);
            customeradded = customeradded.toObject({ getters: false, virtuals: false });
            customeradded = customerRepository.transform(customeradded);
      
            res.status(201).json(customeradded);
          } catch (err) {
            return next(err);
          }


    }

    async getOne(req, res, next) { //C
        const idCustomer = req.params.idCustomer;

        const retrieveOptions = {};
        if (req.query.embed) {
            if (req.query.embed === 'orders') {
                retrieveOptions.orders = true;
            }
        }

        try {
            let customer = await customerRepository.retrieveById(idCustomer, retrieveOptions);

            if (customer) {
                customer = customer.toObject({ getters: false, virtuals: true });
                customer = customerRepository.transform(customer);
                res.status(200).json(customer);
            } else {
                return next(HttpError.NotFound(`Le client ${idCustomer} n'existe pas`));
            }
        } catch (err) {
            return next(err);
        }
    }
}

new CustomerRoutes();

export default router;