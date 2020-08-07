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
  DatePicker,
  TimePicker,
  List,
} from 'antd'

import {
  EditOutlined,
} from '@ant-design/icons'

import lodash from 'lodash'
import moment from 'moment'
import 'moment/locale/ru'

class Doctors extends React.Component{
  state = {
    visible: false,
    name: '',
    age: '',
    gender: '',
    phone: '',
    calendar: [],
    selectedTimes: [],
    selectedDate: '',
    selectedDateValue: '',
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
  
  handleDate = (e) => {
    this.setState({calendar: e})
  }
  
  handleSelectedDate = (e) => {
    let timestamp = moment(e).format('X')
    this.timePickerValue(timestamp)
    this.setState({selectedDate: timestamp})
  }

  handleTime = (e) => {
    const { selectedTimes, selectedDate } = this.state
    
    let timestamp_from = moment(e[0]._d).format('X')
    let timestamp_to = moment(e[1]._d).format('X')
    let index = lodash.findIndex(selectedTimes, {date: selectedDate})
    if(index !== -1){
      selectedTimes.splice(index, 1, {date: selectedDate, time_from: timestamp_from, time_to: timestamp_to})
    } else {
      selectedTimes.push({date: selectedDate, time_from: timestamp_from, time_to: timestamp_to})
    }
    this.setState({selectedTimes: selectedTimes})
  }
  
  timePickerValue = (date) => {
    const { selectedTimes } = this.state
    let selectedTime = selectedTimes.filter(item => item.date === date)
    if(selectedTime.length > 0){
      let newArr = []
      let time_from = moment.unix(selectedTime[0].time_from)
      let time_to = moment.unix(selectedTime[0].time_to)
      newArr.push(time_from)
      newArr.push(time_to)
      this.setState({selectedDateValue: newArr})
    }
    return
  }
  
  render(){
    const { doctors } = this.props
    const { selectedDoctor, calendar, selectedTimes, selectedDateValue } = this.state
    const times = this.intervals()
    
    console.log('selectedTimes', selectedTimes)
    return(
      <Layout>
        <Modal
          title='Добавить доктора'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'fit-content'}
          style={{overflow: 'auto'}}
          okText={'Сохранить'}
        >
          <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto'}}>
            <Form style={{width: '300px'}}>
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
            <section 
              style={{
                width: '300px', 
                display: 'flex', 
                flexDirection: 'column',
                margin: '0 10px'
              }}
            >
              <label>Даты</label>
              <DatePicker.RangePicker onChange={this.handleDate}/>
              <Calendar 
                fullscreen={false} 
                validRange={calendar.length > 0 ? calendar : undefined}
                onChange={(e) => this.handleSelectedDate(e)}
                dateCellRender={() => 
                  <p>123</p>
                }
              />
              <TimePicker.RangePicker 
                value={selectedDateValue !== '' ? selectedDateValue : undefined}
                onChange={this.handleTime}
              />
            </section>
            <section style={{flex: 1}}>
              <List style={{width: '300px', maxHeight: '300px', overflow: 'auto'}}>
                {
                  times.map((time, i) => (
                    <List.Item key={i}>
                      <label>{time}</label>  
                      <TimePicker.RangePicker />
                    </List.Item>
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