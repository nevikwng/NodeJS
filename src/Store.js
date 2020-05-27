import People from './ModuleList'
const myfun = require('./my_fun')
const myfun2 = require('./my_fun')

const PeopleNO1 = new People()
const PeopleNO2 = new People('test',26)
const PeopleNO3 = new People('Darren',27)



console.log(PeopleNO1)
// console.log(PeopleNO2)
// console.log(PeopleNO3)
console.log(myfun())
// console.log(myfun())
// console.log(myfun2())

// console.log(myfun2())
