console.log("4" == 4);
console.log("4" === 4);
console.log(3 === 4);
console.log(4 === 4);

let person = {name : "Bob"};

console.log(person.name);

let myArray = [1,2,3];
console.log(myArray.length); // 3

var print = function printElement(element) {
    console.log(element);
  }
  
myArray.forEach(print); //functions can be passed as arguments

function add(a, b) {
    return a + b;
  }

console.log(add(1, 2)); // 3
console.log(add("1", "2")); // 12


person.setName = function(name){
    this.name = name;
}

person.setName("Paul")

console.log(person.name)

function listPassedArgs(){
    console.log(arguments[0] +arguments[1] + arguments[2]);
}

let Hello = (name) => console.log("Hello " + name); //arrow notation is just short hand for functions

listPassedArgs("Bob", "Paul", "WOW");
Hello("Bob");


let hiToFullName = (name, surname) => {
    let fullName = name + " " + surname;
    console.log("Hi " + fullName);
  }

hiToFullName("Greg", "Sipho");