import React,{Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {browserHistory} from 'react-router'

import SignupForm from './SignupForm'
import DashBoard from './DashBoard'
import Root from './Root'
import Profile from './Profile'

class App extends Component{
	render(){
		return(
			<Router history={browserHistory}>
  			<Route path="/" exact component={Root}>
					<IndexRoute component={SignupForm}/>
					<Route path="/Profile" exact component={Profile}/>
					<Route path="/signup" exact component={SignupForm}/>
					<Route path="/dashboard" exact component={DashBoard}/>
				</Route>
  		</Router>
		)
	}
}

export default App
	


