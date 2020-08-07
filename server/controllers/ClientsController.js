import db from '../dbconfig.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

class UserController{
  constructor(model){    
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
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
}

export default UserController