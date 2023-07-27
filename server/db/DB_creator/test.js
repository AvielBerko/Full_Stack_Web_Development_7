// const mysql = require('mysql2');
//this is a test file to be deleted before finishing the project
const {v4: uuidv4} = require('uuid'); 

const generic = require('../crud.js');
const tables = require('../table_names.js');
const users = require('../components/users.js');

// async function test(){
//     //result = await generic.update(tables.USERS, {email:'test555@gmail.com', name:'test55',  valid: false}, {id: '05e4d024-ae19-4b48-a3ae-cd85470d8f1f'});
//     result = await generic.read(tables.USERS, {valid: true, name:'test3'})
//     console.log(result);
// }

// async function test(){
//     result = await users.login({username: 'itamar', password: 'itamar8236'})
//     console.log(result);
//     console.log(result.length)
// }

// test();


const Joi = require('joi');

console.log('hi!')
const user_schema = Joi.object({
  new: Joi.boolean(),
  username: Joi.string().min(3).max(30).alphanum().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).when('new', {is: true, then: Joi.required()})
})
const userData = {username: 't123', 'email': 'test@gmail.com', }

const { error } = user_schema.validate({...userData, new:true})


if (error) console.log(error.details[0].message)
//console.log(value)



// const schema = Joi.string().guid({
//   version: [
//       'uuidv4',
//       'uuidv5'
//   ]string.isoDate()
