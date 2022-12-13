import expressValidator from 'express-validator';
const { body } = expressValidator;

class PizzeriaValidator {
    complete() {
        return [
            body('coord').exists().isArray().bail(),
            body('planet').exists().withMessage('Requis'),
            body('chef.name').exists().bail(),
            body('chef.ancestor').exists().bail(),
            body('chef.speciality').exists().bail(),
            // body('name').exists().withMessage('Requis'),
            // body('discoveredBy').exists().withMessage('Requis'),
            // body('discoveryDate').exists().withMessage('Requis').isISO8601({ strict: true }).withMessage('doit être une date ISO8601').bail().isBefore(new Date().toISOString()).withMessage('doit être dans le passé'),
            // body('temperature').exists().withMessage('Requis').bail(),
            // body('satellites').exists().isArray().bail(),
            // body('position.x').exists().withMessage('x doit exister').bail(),
            // body('position.y').exists().withMessage('y doit exister').bail(),
            // body('position.z').exists().withMessage('z doit exister').bail(),
            //...this.partial()
        ];
    }

    // partial() {
    //     return [
    //         body('name').optional().isLength({ min: 5, max: 16 }).withMessage('Le nom de la planète doit être compris entre 5 et 16 caractères'),
    //         body('position.x').optional().isFloat({ min: -1000, max: 1000 })
    //     ];
    // }
}

export default new PizzeriaValidator();