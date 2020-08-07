import db from '../dbconfig.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

class DoctorController{
  constructor(model){    
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
    this.patch = this.patch.bind(this)
  }
  
  getOne = async(req, res, next) => {
    try{
      const doctor = await db.Doctors.findOne({
        where: {id: req.params.id}
      })
      res.status(200).send({data: doctor})
    } catch(e){
      console.log('ERR', e)
    }
  }
  
  getAll = async(req, res, next) => {
    try{
      const doctors = await db.Doctors.findAll()
      res.status(200).send({data: doctors})
    } catch(e){
      console.log('ERR', e)
    }
  }

  patch = async(req, res, next) => {
    try{
      const doctor = await db.Doctors.findOne({
        where: {id: req.params.id}
      })
      doctor.update(req.params)
      res.status(204).send()
    } catch(e){
      console.log('ERR', e)
    }
  }
}

export default DoctorController