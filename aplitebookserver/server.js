/*dependency*/
	const express = require('express');
	const app = express();
	const http = require('http')
	const server = http.createServer(app);
	const io = require('socket.io').listen(server);
	const path = require('path')
	const bodyParser = require('body-parser');
	const mongoose = require('mongoose');
	const multer = require('multer');
	const cors = require('cors');
	const PORT = process.env.PORT || 8000
	const serverURL = 'http://192.168.88.73:8000'

	// import Routes from './routes'
const Routes = require('./routes')
const route = new Routes
/*dependency*/

/*multer*/
	const storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, 'card/')
	  },
	  filename: function (req, file, cb) {
	    cb(null, Date.now() + '.'+file.originalname.split('.')[1]) //Appending .jpg
	  }
	})
	const upload = multer({storage:storage})
/*multer*/

/*get body parameteres*/
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cors())
	app.use('/card', express.static(path.join(__dirname, 'card')))
/*get body parameteres*/

/*mongo stuff*/
	mongoose.connect('mongodb://localhost/aplitebook', {useNewUrlParser: true});
	const userSchema = mongoose.Schema({
	  name:{
	    type:String,
	    required: true
	  },
	  email:{
	    type:String,
	    required: true
	  },
	  password:{
	    type:String,
	    required: true
	  }
	});
	
	const cardSchema = mongoose.Schema({
	  userid:{
	    type:String,
	    required: true
	  },
	  username:{
	    type:String,
	    required: true
	  },
	  like:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
		}],
		comments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment'
		}],
	  imgURL:{
	  	type:String,
	  	required:true
	  },
	  createDate:{
	  	type:Date,
	  	required: true
	  }
	});

	const CommentSchema = mongoose.Schema({
		userid: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		comment:{
			type: String,
			required: true
		}
	})
	const User = mongoose.model('user', userSchema);
	const Card = mongoose.model('card', cardSchema);
	const Comment = mongoose.model('comment', CommentSchema);
/*mongo stuff*/

/*User.find().then((data)=>{
	arr = data
	var nameArr = []
	arr.forEach((user, index)=>{
		User.findById(user._id).then(function(data){
			nameArr.push(data.name)
		})	
		setTimeout(()=>{
			if(index==arr.length-1)console.log(nameArr)
		},100)
	})
})*/
// console.log(arr)


/*start server*/
	server.listen(PORT, ()=>console.log(`ApliteBook running on port ${PORT}`))
/*start server*/
let sock
/* socket connection */
	io.sockets.on('connection', (socket) => {
		console.log(socket.id)
		sock = socket
	})
/* socket connection */

/*api*/
	app.get('/', route.firstRout)

	/*http://192.168.88.73:8000/signup*/
	app.post('/signup', async(req, res)=>{
		console.log(req.body)
		let result = await User.find({'email':req.body.email})
		if(!result.length){
			let result = await User.create(req.body)
			res.send(result)
		}
		else{
			res.send('email already exist')
		}
	})

	/*http://192.168.88.73:8000/login*/
	app.post('/login', async(req, res)=>{
		let result = await User.find({'email':req.body.email, 'password':req.body.password}) 
		res.send(result[0])
	})

	/*http://192.168.88.73:8000/getcards*/
	app.get('/getcards',async(req,res)=>{
		let card = await Card.find().sort({ createDate: -1 }).populate('like', 'name').populate('comments')
		res.send(card)
	})

	/*http://192.168.88.73:8000/uplaod*/
	app.post('/upload',upload.any(),async(req,res)=>{
		let card = await Card.create({
			imgURL: `${serverURL}/${req.files[0].path}` ,
			userid : req.body.userid,
			username : req.body.name,
			createDate : new Date(Date.now()).toISOString()	
		})
		res.send(card)
		io.sockets.emit('update card')
		io.sockets.emit('any update',{action:'card', performedById:req.body.userid, performedByName:req.body.name})
	})

	app.get('/likecards/:cardId/:userId',async(req,res)=>{
		let user = await User.findById(req.params.userId, 'name')
		let result = await Card.updateOne({'_id': req.params.cardId}, {$push: { like: user }}, {upsert: true})
		let card = await Card.find({'_id':req.params.cardId}).populate('like','name')
		let newlike = card.map(obj=>{return obj.like})
		res.send(newlike[0])
		io.sockets.emit('update like', newlike[0])
		io.sockets.emit('any update',{action:'like', performedById:req.params.userId, performedByName:user.name, performedOn: card[0].username})
	})

	app.post('/comment', async(req, res)=>{
		let obj = req.body
		let user = await User.findById(req.body.userId, 'name')
		let comment = await Comment.create({
			userid: user._id,
			username: user.name,
			comment: req.body.comment
		})
		let result = await Card.updateOne({ '_id': req.body.cardId }, { $push: { comments: comment._id } }, { upsert: true })
		let comments = await Card.find({ '_id': req.body.cardId }).populate('comments')
		console.log(comments)
		let newcomments = comments.map(obj => { return obj.comments })
		res.send(newcomments[0])
		// io.sockets.emit('update comment', newcomments[0])
		io.sockets.emit('update comment', newcomments[0])
		io.sockets.emit('any update',{action:'comment', performedById:comment.userid, performedByName:comment.username, performedOn: comments[0].username})
	})

/*api*/
