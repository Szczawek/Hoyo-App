Wysyłami żadanie do /add-like, następnie wysyłamy z niego like do db comments i do db likes dodajemy userID i id comments.
W componencie Comments zmieniamy wartość w /comments na
JOIN user ON user.id = comments.userID
JOIN likes ON likes.userID = user.id

app.get("add-like",function(req,res) {
const command = "INSERT INTO likes(userID,commentID) values(?,?)"
const values = [req.body["userID"],req.body["commentID"]]
db.queary(command,values,function(err,result) {
if(err) throw Error(`Error with database #add-like: ${err}`)
})
})

# TWO

Przy usuwaniu komentarzy jak i dodawaniu usunąć window.location.reload() i zastąpić to funckją z odświeżaniem useEffect(()=> {

},[arg])

# THREE

Naprawić wyszukiwarkę(jest to błąd wizualny, nie mechaniczyn)
