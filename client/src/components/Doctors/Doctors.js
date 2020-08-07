import React from 'react'

import { connect } from 'react-redux'
import { getDoctors } from '../../actions/doctors/doctors'

import {
  Layout,
  Card,
  Button,
  Modal,
  Input,
  Form,
  Calendar,
  List,
} from 'antd'

import {
  EditOutlined,
} from '@ant-design/icons'

class Doctors extends React.Component{
  state = {
    visible: false,
    name: '',
    age: '',
    gender: '',
    phone: '',
  }

  componentDidMount(){
    this.props.getDoctors()
  }
  
  componentDidUpdate(prevProps, prevState){

  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = e => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleChange = (key, value) => {
    this.setState({[key]: value})
  }

  handleDoctor = (id) => {
    this.setState({selectedDoctor: id})
  }

  intervals = () => {
    let time = []
    for(let i = 0; i < 13; i++){
      let value = 8 + i + ':' + '00'
      value.toString()
      time.push(value)
    }
    return time
  }

  render(){
    const { doctors } = this.props
    const { selectedDoctor } = this.state
    const times = this.intervals()
    
    return(
      <Layout>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'90%'}
          style={{overflow: 'auto'}}
        >
          <div style={{display: 'flex', flexDirection: 'row', width: '1000px', overflow: 'auto'}}>
            <Form style={{flex: 1}}>
              <Form.Item>
                <label>ФИО</label>
                <Input 
                  onChange={(e) => this.handleChange('name', e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <label>Возраст</label>
                <Input 
                  onChange={(e) => this.handleChange('age', e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <label>Пол</label>
                <Input 
                  onChange={(e) => this.handleChange('gender', e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <label>Телефон</label>
                <Input 
                  onChange={(e) => this.handleChange('phone', e.target.value)}
                />
              </Form.Item>
            </Form>
            <section style={{flex: 1}}>
              <Calendar fullscreen={false}/>
            </section>
            <section style={{flex: 1}}>
              <List style={{maxHeight: '300px', overflow: 'auto'}}>
                {
                  times.map((time, i) => (
                    <List.Item key={i}>{time}</List.Item>
                  ))
                }
              </List>
            </section>
          </div>
        </Modal>
        <Layout.Content>
          <section className='doctors_flex'>
            <Button onClick={() => this.showModal()}>Добавить врача</Button>
            {
              doctors.items.map((doctor, i) => (
                <Card 
                  key={i} 
                  style={{width: selectedDoctor === doctor.id ? '100%' : null}}
                  onClick={() => this.handleDoctor(doctor.id)}
                >
                  <Card.Meta 
                    title={doctor.name}
                    description={doctor.phone}
                  />
                  <div>
                    <Button icon={<EditOutlined />}/>
                    <Button type='primary'>Записаться</Button>
                  </div>
                  
                </Card>
              ))
            }
          </section>
        </Layout.Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  doctors: state.doctors,
  clients: state.clients,
})

const mapDispatchToProps = dispatch => ({
  getDoctors: () => dispatch(getDoctors())
})

export default connect(mapStateToProps, mapDispatchToProps)(Doctors)