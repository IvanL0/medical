import React from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  Card,
} from 'antd'

class Clients extends React.Component{
  state = {

  }

  render(){
    const { doctors } = this.props
    
    return(
      <Layout>
        <Layout.Content>
          <section className='doctors_flex'>
            {
              doctors.items.map((doctor, i) => (
                <Card key={i}>
                  <Card.Meta 
                    title={doctor.name}
                    description={doctor.phone}
                  />
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
})

const mapDispatchToProps = dispatch => ({
  getDoctors: () => dispatch()
})

export default connect(mapStateToProps, mapDispatchToProps)(Clients)