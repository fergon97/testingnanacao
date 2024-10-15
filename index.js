const express = require('express')
const app = express()
const cafes = require('./cafes.json')

app.listen(3000, console.log('Server on port 3000'))

app.use(express.json())

app.get('/cafes', (req, res) => {
    res.status(200).send(cafes)
})

app.get('/cafes/:id', (req, res) => {
    const { id } = req.params
    const cafe = cafes.find(c => c.id == id)
    if (cafe) res.status(200).send(cafe)
    else res.status(404).send({ message: '404: No coffee found with that id.' })
})

app.post('/cafes', (req, res) => {
    const cafe = req.body
    const { id } = cafe
    const existeUncafeConEseId = cafes.some(c => c.id == id)
    if (existeUncafeConEseId) res.status(400).send({ message: '400: There is already a cafe with that id.' })
    else {
        cafes.push(cafe)
        res.status(201).send(cafes)
    }
})

app.put('/cafes/:id', (req, res) => {
    const cafe = req.body
    const { id } = req.params
    if (id !== cafe.id)
        return res
            .status(400)
            .send({
                message: '400: The parameter id does not match the received coffee id.',
            })

    const cafeIndexFound = cafes.findIndex((p) => p.id == id)
    if (cafeIndexFound >= 0) {
        cafes[cafeIndexFound] = cafe
        res.send(cafes)
    } else {
        res
            .status(404)
            .send({ message: '404: No coffee found with that id.' })
    }
})

app.delete('/cafes/:id', (req, res) => {
    const jwt = req.header('Authorization')
    if (jwt) {
        const { id } = req.params
        const cafeIndexFound = cafes.findIndex(c => c.id == id)

        if (cafeIndexFound >= 0) {
            cafes.splice(cafeIndexFound, 1)
            console.log(cafeIndexFound, cafes)
            res.send(cafes)
        } else {
            res.status(404).send({ message: '404: No coffee found with that id.' })
        }

    } else res.status(400).send({ message: '400: Did not receive any tokens in the headers.' })
})

app.use('*', (req, res) => {
    res.status(404).send({ message: '404: Not found.' })
})

module.exports = app