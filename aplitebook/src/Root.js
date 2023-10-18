import React,{Component} from 'react'

import Header from './Header' 

class Root extends Component{
	render(){
		return(
			<div className="container">
				<div className="row">
					<Header child={this.props.children}/>
				</div>	
				<div className="row">
					{this.props.children}
				</div>	
			</div>
		)
	}
}
export default Root