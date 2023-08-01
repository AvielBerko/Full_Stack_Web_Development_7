function unauthorized_response(res) {
    res.status(401).send({ error: 'Unauthorized action' })
}

function no_Changes_response(res) {
    res.status(400).send({ error: 'No changed were made!' })
}

module.exports = { unauthorized_response, no_Changes_response }
