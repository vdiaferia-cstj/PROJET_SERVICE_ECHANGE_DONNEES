import express from 'express';
import HttpError from 'http-errors';
import ordersRepositories from '../repositories/orders.repositories.js';
import paginate from 'express-paginate';

const router = express.Router();

class OrdersRoutes {

    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll); //C
        router.get('/:idPizzeria/orders/:idOrder', this.getOne); //B

    }

    async getAll(req, res, next) {//C
        try {
            const retrieveOptions = {
                limit: req.query.limit,
                skip: req.skip,
                topping: req.query.topping
            }

            let [orders, itemsCount] = await ordersRepositories.retrieve(retrieveOptions);

            orders = orders.map(o => {
                o = o.toObject({ getters: false, virtuals: false });
                o = ordersRepositories.transform(o);
                return o;
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
                data: orders
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

            res.status(200).json(payload.data);

        } catch (err) {
            return next(err);
        }
    }
    getOne(req, res, next) { //B

        try {
            const retrieveOptions = {};
            if (req.query.embed && req.query.embed === 'customer') {
                retrieveOptions.customer = true;
            }

            const idCustomer = req.query.idCustomer;

        } catch (err) {
            return next(err);
        }
    }
}

new OrdersRoutes();

export default router;