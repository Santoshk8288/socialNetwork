import React,{Component} from 'react'
import { withBaseIcon } from 'react-icons-kit'
import {ic_thumb_up} from  'react-icons-kit/md/ic_thumb_up'
import request from 'superagent'

class PicCard extends Component{
	constructor(props){
		super()
		this.state={
			likeColor:'#A2A7AB',
			isliked:false,
			likes:[],
			comment:'',
			comments:[],
			showComments:false,
			socket : null
		}
		
	}
	
	async like(){
		if(! this.state.isliked){
			this.setState({likeColor:'#0882EA'})
			let result = await fetch('http://192.168.88.73:8000/likecards/'+this.props.obj._id+'/'+this.props.user)
			.then(response => response.json())
			const newLike = result.map(obj=>{
				if(obj._id === this.props.user ){
					this.setState({likeColor:'#0882EA', isliked:true})
					return 'you'
				} 
				else return obj.name
			})
			this.setState({likes:newLike})
		}
	}
	
	async componentDidMount(){
		await this.setState({socket:this.props.socket})
		this.state.socket.on('update like',async (data)=>{
			 const newLike = data.map(obj => {
				if (obj._id === this.props.user) {
					this.setState({ likeColor: '#0882EA', isliked: true })
					return 'you'
				}
				else return obj.name
			})
			await this.setState({ likes: newLike })
		})
		this.state.socket.on('update comment', async(data)=>{
			const newComments = data.map(obj => {
				return (
					<div key={obj._id}>
						<span style={{ 'color': '#0882EA', 'fontSize': '13px' }}>{obj.userid === this.props.user ? 'you' : obj.username} :</span>  <span style={{ 'fontSize': '13px' }}>{obj.comment}</span>
					</div>
				)
			})
			await this.setState({ comments: newComments })
		})
		const newLike = this.props.obj.like.map(obj=>{
			if(obj._id === this.props.user ){
				this.setState({likeColor:'#0882EA', isliked:true})
				return 'you'
			} 
			else return obj.name
		})
		const newComments = this.props.obj.comments.map(obj=>{
			return(
				<div key={obj._id}>
					<span style={{ 'color': '#0882EA', 'fontSize': '13px' }}>{obj.userid === this.props.user ? 'you' : obj.username} :</span>  <span style={{'fontSize': '13px'}}>{obj.comment}</span>
				</div>
			)
		})
		await this.setState({likes:newLike})
		await this.setState({comments:newComments})
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	async comment(){
		if(this.state.comment !== ''){
			let comments = await request
				.post("http://192.168.88.73:8000/comment")
				.send({
					cardId: this.props.obj._id,
					userId: this.props.user,
					comment: this.state.comment
				})
			const newComments = comments.body.map(obj => {
				return (
					<div key={obj._id}>
						<span style={{ 'color': '#0882EA', 'fontSize': '13px' }}>{obj.userid === this.props.user ? 'you' : obj.username} :</span>  <span style={{ 'fontSize': '13px' }}>{obj.comment}</span>
					</div>
				)
			})
			this.setState({ comments: newComments })
			this.setState({ comment: '' })
		}
		
	}
	showComments(){
		this.setState({showComments:!this.state.showComments})
	}
	render(){
		const SideIconContainer = withBaseIcon({ size: 20, style: {color: this.state.likeColor, margin:'0px'}})
		return(
			<div className="card" style={{"width": "18rem", 'margin':'0 auto', 'padding':'10px'}}>
				<div className="card-body">
					<h5 className="card-title" style={{"textAlign": "center"}}>{this.props.obj.username}</h5>
					<img className="card-img-top" src={this.props.obj.imgURL} style={{"width":"150px","display": "block", "margin": "0 auto"}}/>
				</div>
				<div style={{ 'borderTop': '1px solid #f6f6f6', 'borderBottom': '1px solid #f6f6f6'}}>
					<SideIconContainer icon={ic_thumb_up} onClick={this.like.bind(this)} /> <span style={{ 'color': '#0882EA', 'fontSize': '13px' }}>{this.state.likes.length}</span>
					<span style={{'color': '#0882EA', 'fontSize': '13px', 'float': 'right'}} onClick={this.showComments.bind(this)}>comments {this.state.comments.length}</span>
					<br/><span style={{ 'color': '#0882EA', 'fontSize': '13px' }}>{this.state.likes.toString()}</span>
					<div style={{'display':this.state.showComments? 'block':'none'}}>
						{this.state.comments}
					</div>
				</div>
				<div style={{ 'display': 'flex' }}>
					<input type="text" name="comment" className="form-control" placeholder="comment" value={this.state.comment} onChange={this.handleChange.bind(this)} />	
					<button onClick={this.comment.bind(this)}>post</button>
				</div>
			</div>
		)
	}
}

export default PicCard