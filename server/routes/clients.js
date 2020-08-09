'use strict'

import express from 'express'
import ClientController from '../controllers/ClientsController.js'
import checkAPIs from 'express-validator'
import filterAPIs from 'express-validator'

const { check, validationResult, oneOf, body } = checkAPIs
const { matchedData  } = filterAPIs

const router = express.Router()

const Client = new ClientController()

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(422).json({ errors: errors.array() })
  }
}


router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.post('/', validate([
  check('name').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('age').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('gender').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('phone').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('time').not().isEmpty().withMessage('Поле не может быть пустым'),
]), (req, res, next) => {

  Client.create(req, res, next)
})


export default router