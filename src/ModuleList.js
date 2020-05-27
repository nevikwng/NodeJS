class People {

    constructor(name = 'undefield', age = 'undefield') {

        this.name = name,
            this.age = age
    }

    JSONstringify() {

        const PeopleObj = {

            name: this.name,
            age: this.age
        }
        return JSON.stringify(PeopleObj)
    }

}

export default People

