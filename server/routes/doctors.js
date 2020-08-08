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
  
    console.log('DATA', req.body)
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

router.get('/:id', (req, res, next) => {

  Doctor.getOne(req, res, next)
})

router.post('/', validate([
  check('name').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('age').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('gender').not().isEmpty().withMessage('Поле не может быть пустым'),
  check('phone').not().isEmpty().withMessage('Поле не может быть пустым'),
]), (req, res, next) => {
  Doctor.create(req, res, next)
})

router.patch('/:id', validate([
  check('name').optional().not().isEmpty().withMessage('Поле не может быть пустым'),
  check('age').optional().not().isEmpty().withMessage('Поле не может быть пустым'),
  check('gender').optional().not().isEmpty().withMessage('Поле не может быть пустым'),
  check('phone').optional().not().isEmpty().withMessage('Поле не может быть пустым'),
  check('timetable').optional().not().isEmpty().withMessage('Поле не может быть пустым'),
]), (req, res, next) => {
  Doctor.update(req, res, next)
})

export default router