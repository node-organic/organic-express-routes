module.exports = function(plasma, dna, helpers){
  return {
    "GET": function(){},
    "POST": function(){
      return helpers["index"]()
    }
  }
}