import db from '../dbconfig.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

class UserController{
  constructor(model){    
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
    this.create = this.create.bind(this)
  }
  
  getOne = async(req, res, next) => {
    console.log('REQ_DATA', req.headers.authorization)
    let uuid = req.headers.authorization
    
    try{
      const user = await db.User.findOne({
        where: {uuid: uuidBuffer.toBuffer(uuid)}
      })
      res.status(200).send({data: user})
    } catch(err){
      console.log('ERR', err)
    }
  }
  
  getAll = async(req, res, next) => {
    try{
      const clients = await db.Clients.getAll()
      res.status(200).send({data: clients})
    }catch(e){
      console.log('Err', e)
    }
  }
  
  create = async(req, res, next) => {
    const registration = req.body
    
    try{
      const client = await db.Clients.create({
        name: registration.name,
        age: registration.age,
        gender: registration.gender,
        phone: registration.phone,
      })
      
      await db.Appointment.create({
        time: registration.time,
        timetable_id: registration.timetable_id,
        clients_id: client.dataValues.id,
      })
      
      res.status(201).send()
      
    }catch(e){
      console.log('ERR', e)
    }
  }
  
  update = async(req, res, next) => {
    const client = req.body
    
    try{
      await db.Clients.create({
        name: client.name,
        age: client.age,
        gender: client.gender,
        phone: client.phone,
      })
      
      res.status(201).send()
      
    }catch(e){
      console.log('ERR', e)
    }
  }
}

export default UserController