const request = require('supertest')
const server = require('../index')

const creatingNewId = arr => {
    const totalIDs = arr.map(item => item.id).sort((a, b) => b - a)
    totalIDs.splice(1, totalIDs.length - 1)
    const newId = totalIDs[0] + 1
    return newId
}

describe('COFFEE CRUD', () => {

    it('200 STATUS CODE, BODY IS AN ARRAY WITH AT LEAST 1 OBJECT.',
        async () => {
            const { body, statusCode } = await request(server).get('/cafes').send()
            expect(statusCode).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body.length).toBeGreaterThanOrEqual(1)
    })

    it('404 STATUS CODE AFTER DELETING A NON-EXISTENT ID',
        async () => {
            const jwt = 'token'
            const { body } = await request(server).get('/cafes').send()
            const idToDelete = creatingNewId(body)
            const { statusCode } = await request(server).delete(`/cafes/${idToDelete}`)
            .set('Authorization', jwt).send()
            expect(statusCode).toBe(404)
    })

    it('201 STATUS CODE ADDING A NEW COFFEE', async () => {
        const { body } = await request(server).get('/cafes').send()
        const newID = creatingNewId(body)
        const { statusCode } = await request(server).post('/cafes').send({
            id: newID,
            nombre: 'Your new Brand coffee-name!'
        })
        expect(statusCode).toBe(201)
    })

    it('400 STATUS CODE AFTER TRYING UPDATING A COFFEE WITH A DIFFERENT/NON-EXISTING ID',
        async () => {
            const { body } = await request(server).get('/cafes').send()
            const newID = creatingNewId(body)
            const firstCoffee = body[0]
            const { statusCode } = await request(server).put(`/cafes/${newID}`).send(firstCoffee)
            expect(statusCode).toBe(400)
    })
    
})