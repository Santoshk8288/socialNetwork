import React, { Component } from 'react'
import request from 'superagent'
import io from 'socket.io-client'
import PicCard from './PicCard'
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const socketURL ='192.168.88.73:8000'

class DashBoard extends Component {
  constructor() {
    super()
    this.state = {
      id: '',
      name: '',
      email: '',
      card: [],
      socket:null
    }
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }
  
  componentWillMount(){
    this.initSocket()
  }
  
  addNotification(obj) {
    // if(this.notificationDOMRef){
      this.notificationDOMRef.current.addNotification({
        title: obj.title,
        message: obj.message,
        type: "info",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
    // }
  }

  async initSocket(){
    const socket = io.connect(socketURL)
    await this.setState({socket:socket})
    
    socket.on('connect', ()=>{
      console.log('connected')
    })
    socket.on('update card',async(data)=>{
      let card = await fetch`http://192.168.88.73:8000/getcards`
      .then(response => response.json())
      await this.setState({card: card})
      
    })
    socket.on('any update', (data)=>{
      let msg = ''
      if(data.action === 'card') msg =`${data.performedByName} has added new card`
      if(data.action === 'like') msg = `${data.performedByName} has liked ${data.performedOn}'s card`
      if(data.action === 'comment') msg = `${data.performedByName} has commented on ${data.performedOn}'s card` 
      if(data.performedById !== this.state.id){
        let obj = {
          title : `New ${data.action}`,
          message : msg
        }
        console.log(this.notificationDOMRef.current)
        if(this.notificationDOMRef.current)this.addNotification(obj)
      }
    })
  }

  async componentDidMount() {
    this.setState({
      id: this.props.location.state.detail._id,
      name: this.props.location.state.detail.name,
      email: this.props.location.state.detail.email
    })
    let card = await fetch`http://192.168.88.73:8000/getcards`
    .then(response => response.json())
    await this.setState({card: card})
  }

  async upload() {
    this.setState({ isActive: false })
    let fd = new FormData()
    fd.append('image', this.state.file)
    fd.append('userid', this.state.id)
    fd.append('name', this.state.name)
    let result = await request.post(`http://192.168.88.73:8000/upload,${fd}`)
    
  }

  

  render() {
    const newArr = this.state.card.map(card => {
      return (
        <div key={card._id}>
          <PicCard obj={card} user={this.state.id} socket={this.state.socket}/>
  				<br/>
				</div>
      )
    })
    return (
      <div className="row container">
			  <ReactNotification ref={this.notificationDOMRef} />
        <div className="col-md-2"></div>
				<div className="col-md-8">
					<br />
					{newArr}
				</div>
				<div className="col-md-2"></div>
			</div>
    )
  }
}
export default DashBoard