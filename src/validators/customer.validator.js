import expressValidator from 'express-validator';
import { PLANET_NAMES } from '../libs/constants.js';

 const {body} = expressValidator;


class CustomerValidator {

    complete(){
        return [
            body('planet').exists().withMessage('Nom de planète requis').withMessage('Nom invalide').bail(),
            body('email').exists().withMessage('Email requis').bail(),
            body('name').exists().withMessage('Nom requis').bail(),
            body('coord.lat').exists().isFloat({min: -1000, max: 1000}).withMessage('Latitude entre -1000 et 1000 requise').bail(),
            body('coord.lon').exists().isFloat({min: -1000, max: 1000}).withMessage('Longitude entre -1000 et 1000 requise').bail(),
            body('coord').exists().bail(),
            body('phone').exists().withMessage('Requis').isLength({min:16,max:20}).bail(),
            body('birthday').exists().isISO8601({strict:true}).withMessage('doit être une date ISO8601').bail()
        ]
    }
    
  
}

export default new CustomerValidator();