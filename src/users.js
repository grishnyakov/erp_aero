module.exports ={
    getUser: function(params){
        console.log(params)
        return {
            id: params.id,
        }
    }
}