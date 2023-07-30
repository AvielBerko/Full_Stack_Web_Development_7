function unauthorized_response(res){
    res.status(401).send({error: 'Unauthorized action'})
}

module.exports = {unauthorized_response}
