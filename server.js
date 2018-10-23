const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex') ({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres1',
    database : 'FaceRecognition'
  }
});
 
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	 knex.select('email', 'hash')
	 	.from('login')
	 	.where('email', '=', email)
	 	.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				knex.select('*')
				.from('users')
				.where('email', '=', email)
				.then(user => {
					res.json(user);
				})
				.catch(err => {res.status(400).json('error getting user')})	
			}
			else{
				res.status(400).json('wrong credentials');				
			}
	 	})
	 	.catch(err => {res.status(400).json('wrong credentials')})
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	knex.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user =>{
				res.json(user);		
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => {
		res.status(400).json('registration failed');
	})	
})

app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	knex.select('*').from('users').where({
		id: id
	}).then(user => {
		if(user.length){
			res.json(user[0]);
		}else{
			res.status(400).json('error getting user');
		}
	})
	.catch(err => res.status(400).json('errror getting user'))
})

app.put('/image', (req, res) =>{
	const { id } = req.body;
	knex('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('errror during update'))
})

app.listen(3000, () => {
	console.log('app is running.')
});