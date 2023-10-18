import React,{Component} from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'

class Header extends Component{
	constructor(){
		super()
		this.state={
			email: "",
			password: "",
			emailError:false,
			passwordError:false,
			user :{}
		}
		this.handleButton = this.handleButton.bind(this)
		// if (this.props)
		// 	this.setState({ user: this.props.child.props.location.state.detail })
	}

	handelError(name, value){
		if(name === 'email'){
			if(value==="")this.setState({emailError:true})
			else this.setState({emailError:false})
		}
		else{
			if(value==="")this.setState({passwordError:true})	
			else this.setState({passwordError:false})
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

	async handleClick(event){
		event.preventDefault()
		let user = await request
		.post`http://192.168.88.73:8000/login`
		.send({email: this.state.email, password: this.state.password })
		if(user.body){
			await this.setState({user : user.body})
			browserHistory.push({
				pathname: '/dashboard',
				state: { detail: this.state.user }
			})
		}
		else{
			alert('no user')
		}
	}	

	handleLogout(){
		browserHistory.push('/')
	}

	async handleButton(path){
		await this.setState({ user: this.props.child.props.location.state.detail })
		browserHistory.push({
			pathname : `/${path}`,
			state: { detail: this.state.user }
		})
	}
	
	render(){
		let preParams = this.props.child.props.location
		return(
			<nav className="navbar navbar-expand-lg navbar-light bg-light container">
				<a className="navbar-brand" href="#">Aplite Book</a>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
  				<ul className="navbar-nav mr-auto">
						<li>
							<button 
								className="btn btn-outline-success my-2 my-sm-0"
								style={{display:preParams.state?'block':'none'}}
								onClick={()=>this.handleButton('dashboard')}
							>Dashboard</button>
						</li>
						<li>&nbsp;</li>
						<li>	
							<button 
								className="btn btn-outline-success my-2 my-sm-0"
								style={{display:preParams.state?'block':'none'}}
								onClick={()=>this.handleButton('profile')}
							>profile</button>
						</li>
					</ul>
					<form className="form-inline my-2 my-lg-0" style={{display:preParams.state?'none':'block'}}>
						<input 
							className="form-control mr-sm-2" 
							type="email" 
							placeholder="Email" 
							name="email"
							value={this.state.email} 
							onFocus={this.handleFocus.bind(this)} 
							onBlur={this.handleBlur.bind(this)} 
							onChange={this.handleChange.bind(this)}
						/>
						<input 
							className="form-control mr-sm-2" 
							type="password" 
							placeholder="Password" 
							name="password"
							value={this.state.password} 
							onFocus={this.handleFocus.bind(this)} 
							onBlur={this.handleBlur.bind(this)} 
							onChange={this.handleChange.bind(this)}
						/>
						<button 
							className="btn btn-outline-success my-2 my-sm-0" 	
							onClick={this.handleClick.bind(this)}
							disabled={this.state.emailError || this.state.passwordError}
						>Login</button>
					</form>
					<button 
						className="btn btn-outline-danger my-2 my-sm-0"
						style={{display:preParams.state?'block':'none'}}
						onClick={this.handleLogout.bind(this)}
					>Sign out</button>
				</div>
			</nav>
		)
	}
}

export default Header