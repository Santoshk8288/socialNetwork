import React,{Component} from 'react'
import {Link} from 'react-router-dom'

class Navbar extends Component{
	/*componentDidMount(){
		console.log(this.router)
	}*/
	constructor(props, {match}) {
		super(props);
		// console.log(props)
	}
	
	render(){
		return(
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<a className="navbar-brand" href="#">Navbar</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

  				<div className="collapse navbar-collapse" id="navbarSupportedContent">
    				<ul className="navbar-nav mr-auto">
						<li className="nav-item active">
							<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">Link</a>
						</li>
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Dropdown
							</a>
							<div className="dropdown-menu" aria-labelledby="navbarDropdown">
							<a className="dropdown-item" href="#">Action</a>
							<a className="dropdown-item" href="#">Another action</a>
							<div className="dropdown-divider"></div>
							<a className="dropdown-item" href="#">Something else here</a>
							</div>
						</li>
						<li className="nav-item">
							<a className="nav-link disabled" href="#">Disabled</a>
						</li>
    				</ul>
					<form className="form-inline my-2 my-lg-0">
						<input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
						<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
					</form>
  				</div>
			</nav>
		)
		
	}
}

export default Navbar

{/* <nav className="navbar navbar-expand-lg navbar-light bg-light container">
			  <div className="container-fluid">
			    <div className="navbar-header">
			      <Link to="#" className="navbar-brand">Aplite Book</Link>
			    </div>
			    <ul className="nav navbar-nav">
					<li className={preParams.pathname === '/home' ? 'active' : ''} >
					  <Link to={'/home'}>Home  </Link>
					</li> 
			      	<li className={preParams.pathname === '/login' ? 'active' : ''} style={{display:preParams.state?'none':'block'}}>
					  <Link to={'/login'}>Login</Link>
					</li>
			      	<li className={preParams.pathname === '/signup' ? 'active' : ''} style={{display:preParams.state?'none':'block'}}>
					  <Link to={'/signup'}>Sign up</Link>
					</li>
				  	<li className="" style={{display:preParams.state?'block':'none'}}>
					  <Link to={'/home'}>Sign out</Link>
					</li>
			    </ul>
			  </div>
			</nav> */}

