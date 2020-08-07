'use strict'

import express from 'express'
import DoctorController from '../controllers/DoctorsController.js'
import checkAPIs from 'express-validator'
import filterAPIs from 'express-validator'

const { check, validationResult, oneOf, body } = checkAPIs
const { matchedData  } = filterAPIs

const router = express.Router()

const Doctor = new DoctorController()

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

router.get('/', (req, res, next) => {

  Doctor.getAll(req, res, next)
})


export default router