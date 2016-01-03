// // // Value will be not upadated here
// // var person = {
// // 	name: 'Sunny',
// // 	age: 19
// // };


// // function updatePerson(obj){
// // 	obj = {
// // 		name: 'Sunny',
// // 		age: 20
// // 	};
// // }

// // updatePerson(person);
// // console.log(person);

// // Value will be upadated here


// var person = {
// 	name: 'Sunny',
// 	age: 19
// };


// function updatePerson(obj){
// 	// obj = {
// 	// 	name: 'Sunny',
// 	// 	age: 20
// 	// };
// 	// Mutating the object
// 	obj.age = 20;
// }

// updatePerson(person);
// console.log(person);

/* Booleans, numbers and strings can't be referenced */
/* Arrays and objects can be referenced */

//Challenge Array Example
console.log('Challenge');
array = [15, 27];

function addGrade(arr){
	// Will change
	arr.push(12);
	//debugger;
}

function assignaddGrade(arr){

	// Will not change
	arr = [15, 27, 12, 13];
}

addGrade(array);
console.log(array);

assignaddGrade(array);
console.log(array);
