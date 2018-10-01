const express = require('express');

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'brutalPass',
			entries: 0 ,
			joined: new Date()
		},
		{
			id: '321',
			name: 'Ana',
			email: 'ana@gmail.com',
			password: 'anaBanana',
			entries: 0 ,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.send('GET is working on port 3000');
})

app.post('/signin', (req, res) => {
	res.json('POST signin is working');	
});

app.listen(3000, () => {
	console.log('app is running.')
});