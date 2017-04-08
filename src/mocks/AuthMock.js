const faker = require('faker');

const AuthObject = {
		username: faker.name.findName(),
		password: faker.random
};

module.exports = AuthObject;

const AuthObjectBadPw = {
		username: faker.name.findName(),
		password: faker.random + "wrong"
};

module.exports = AuthObjectBadPw;

const AuthObjectEmpty = {
		username: "",
		password: ""
};
module.exports = AuthObjectEmpty;