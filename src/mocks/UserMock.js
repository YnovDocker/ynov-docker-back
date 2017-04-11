const faker = require('faker');

module.exports = {
		User: {
				username: faker.name.findName(),
				email: faker.internet.email(),
				password: faker.random,
				firstname: faker.name.findName(),
				lastname: faker.name.findName(),
				role: faker.random
		},
		RegisterUserObject: {
				username: "username",
				email: "username@test.com",
				password: "password",
				firstname: "firstname",
				lastname: "lastname",
				passwordConfirmation: "password"
		},
		RegisterUserObjectBadPwConfirmation: {
				username: "username",
				email: "username@test.com",
				password: "password",
				firstname: "firstname",
				lastname: "lastname",
				passwordConfirmation: "wrongPassword"
		},
		RegisterUserObjectBadEmail: {
				username: "username",
				email: "username@test.",
				password: "password",
				firstname: "firstname",
				lastname: "lastname",
				passwordConfirmation: "password"
		},
		RegisterUserObjectEmptyField: {
				username: "username",
				email: "username@test.",
				password: "password",
				firstname: "",
				lastname: "",
				passwordConfirmation: "password"
		}
};