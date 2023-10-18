import React,{Component} from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'

class SignupForm extends Component{
	constructor(){
		super()
		this.state={
			name:"",
			email: "",
			password: "",
			confirmPassword:"",
			emailError:false,
			passwordError:false,
			confirmPasswordError:false,
			user :{}
		}
	}

	handelError(name, value){
		if(name === 'email'){
			if(value==="")this.setState({emailError:true})
			else this.setState({emailError:false})
		}
		else if(name==='password'){
			if(value==="")this.setState({passwordError:true})	
			else this.setState({passwordError:false})
		}
		else if(name==='confirmPassword'){
			if(value!==this.state.password)this.setState({confirmPasswordError:true})
			else this.setState({confirmPasswordError:false})
		}
	}

	handleFocus(event){
		const {name, value} = event.target
		this.handelError(name, value)
	}

	handleBlur(event){
		const {name, value} = event.target
		this.handelError(name, value)
	}

	handleChange(event){
		const {name, value} = event.target
	 	this.setState({[name] : value})
	 	this.handelError(name, value)
	}

	handleClick = async(event)=>{
		event.preventDefault()
		let user  = await request
		.post("http://192.168.88.73:8000/signup")
		.set("Content-Type", "application/x-www-form-urlencoded")
		.send({
			name: this.state.name,
			email: this.state.email, 
			password: this.state.password 
		})
		this.setState({ user: user.body})
		browserHistory.push({
			pathname: '/dashboard',
			state: { detail: this.state.user }
		})
	}

	render(){
		return(
			<div className="row container">
				<div className="col-md-6">
					<h1>hello </h1>
				</div>
			  <div className="col-md-6">
					<form className="container">
						<div className="form-group">
							<label>User Name</label>
							<input type="text" name="name" className="form-control" placeholder="Enter Name" value={this.state.name} onFocus={this.handleBlur.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={this.handleChange.bind(this)}/>
						</div>
						<div className="form-group">
							<label>Email address</label>
							<input type="email" name="email" className="form-control" placeholder="Enter email" value={this.state.email} onFocus={this.handleBlur.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={this.handleChange.bind(this)}/>
							<small className="form-text" style={{display:this.state.emailError?'block':'none', 'color':'#FF0006'}}>please provide email.</small>
						</div>
						<div className="form-group">
							<label>Password</label>
							<input type="password" name="password" className="form-control" placeholder="Password" value={this.state.password} onFocus={this.handleBlur.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={this.handleChange.bind(this)}/>
							<small className="form-text" style={{display:this.state.passwordError?'block':'none', 'color':'#FF0006'}}>please provide password.</small>
						</div>
						<div className="form-group">
							<label>Confirm-Password</label>
							<input type="password" name="confirmPassword" className="form-control" placeholder="Password" value={this.state.confirmPassword} onFocus={this.handleBlur.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={this.handleChange.bind(this)}/>
							<small className="form-text" style={{'display':this.state.confirmPasswordError?'block':'none', 'color':'#FF0006'}}>confirm password should be same.</small>
						</div>
						<button className="btn btn-primary" onClick={this.handleClick.bind(this)} disabled={this.state.emailError || this.state.passwordError || this.state.confirmPasswordError} >Submit</button>
					</form>
				</div>
			</div>
		)
	}
}

export default SignupForm