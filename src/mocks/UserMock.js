const faker = require('faker');

const User = {
		username: faker.name.findName(),
		email: faker.internet.email(),
		password: faker.random,
		firstname: faker.name.findName(),
		lastname: faker.name.findName(),
		role: faker.random
};
module.exports = User;

const RegisterUserObject = {
		username: "username",
		email: "username@test.com",
		password: "password",
		firstname: "firstname",
		lastname: "lastname",
		passwordConfirmation: "password"
};
module.exports = RegisterUserObject;

const RegisterUserObjectBadPwConfirmation = {
		username: "username",
		email: "username@test.com",
		password: "password",
		firstname: "firstname",
		lastname: "lastname",
		passwordConfirmation: "wrongPassword"
};
module.exports = RegisterUserObjectBadPwConfirmation;

const RegisterUserObjectBadEmail = {
		username: "username",
		email: "username@test.",
		password: "password",
		firstname: "firstname",
		lastname: "lastname",
		passwordConfirmation: "password"
};
module.exports = RegisterUserObjectBadEmail;

const RegisterUserObjectEmptyField = {
		username: "username",
		email: "username@test.",
		password: "password",
		firstname: "",
		lastname: "",
		passwordConfirmation: "password"
};
module.exports = RegisterUserObjectEmptyField;