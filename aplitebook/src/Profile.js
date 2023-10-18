import React,{Component} from 'react'
import Modal from 'react-modal'
import request from 'superagent'

import img1 from './img1.png'

class Profile extends Component{
	constructor(){
		super()
		this.state = {
			id : '',
			name : '',
			email : '',
			card : [],
			isActive : false,
			img : img1,
			uploadButton : false,
			file : null
		}
	}
	
	componentDidMount(){
		this.setState({
			id: this.props.location.state.detail._id,
			name : this.props.location.state.detail.name,
			email : this.props.location.state.detail.email
		})
	}
	
	toggel(){
		this.setState({isActive:!this.state.isActive})
	}
	
	async upload(){
		this.setState({isActive:false})
		let fd = new FormData()
		fd.append('image',this.state.file)
		fd.append('userid', this.state.id)
		fd.append('name', this.state.name)
		let result = await request.post("http://192.168.88.73:8000/upload",fd )
	}
	
	handleChange(event){
		let file = event.target.files
		this.setState({file:event.target.files[0]})
		let reader = new FileReader()
		reader.readAsDataURL(file[0])
		reader.onload=(e)=>{
			this.setState({img:e.target.result, uploadButton:true})
		}
	}
	
	render(){
		return(
			<div className="container">
				<h3>Aplite Book</h3>
				<p>Now upload your pics and show to your friends and get likes and comment on them.</p>
				<p>{this.state.name}'s dashboard.</p>
				<p>Welcome {this.state.name} !!!</p>
				<br /><br/>
				<button onClick={this.toggel.bind(this)}>Upload images</button>	
				<br /><br/>
				<Modal isOpen={this.state.isActive} >
					<h2>Upload your images</h2>
					<ul>
						<li>
							<img src={this.state.img} style={{"width":"200px"}}/><br/><br/>
							<input type="file" name="file" onChange={this.handleChange.bind(this)} style={{display:this.state.uploadButton?'none':'block'}}/>
							<button onClick={this.upload.bind(this)} style={{display:this.state.uploadButton?'block':'none'}}>Upload</button>
						</li>
						
					</ul>
				</Modal>
			</div>
		)
	}
}
Modal.setAppElement('#root');

export default Profile