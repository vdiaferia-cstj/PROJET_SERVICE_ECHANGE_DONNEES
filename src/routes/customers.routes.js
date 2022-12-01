import express from 'express';
import HttpError from 'http-errors';
import customerRepository from '../repositories/';

const router = express.Router(); 

class CustomerRoutes {
    
    constructor() {
        router.post('/', this.postOne); //B
        router.put('/:idCustomer', this.updateOne); //A
        router.get('/', this.getAll); //A
        router.get('/:idCustomer', this.getOne); //C
        
    }

   async getAll(req, res, next) {//A
        try {

            const retrieveOptions = {
                limit: req.query.limit,
                skip: req.skip,
                planet: req.query.planet
            }

            console.log(req.skip);

            let [customers, itemsCount] = await explorationsRepository.retrieve(retrieveOptions);

            explorations = explorations.map(e => {
                e = e.toObject({ getters: false, virtuals: false });
                e = explorationsRepository.transform(e);

                return e;
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
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: `${process.env.BASE_URL}${links[2].url}`
                },
                data: explorations
            }

            if (req.query.page === 1) {
                //[0] => self
                //[1] => next
                //prev => delete
                payload._links.self = `${process.env.BASE_URL}${links[0].url}`;
                payload._links.next = `${process.env.BASE_URL}${links[1].url}`;
                delete payload._links.prev;
            }

            if (!hasNextPage) {
                //[0] 
                //[1] => prev
                //[2] => self
                //next => delete
                payload._links.prev = `${process.env.BASE_URL}${links[1].url}`;
                payload._links.self = `${process.env.BASE_URL}${links[2].url}`;
                delete payload._links.next;
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