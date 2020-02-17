// Déclarations des dépendances

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Initialisation de la connexion a la base de données
mongoose.connect('mongodb://localhost/todoList', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Récuperation des models
let User = require('./models/user');
let List = require('./models/list');
let Task = require('./models/task');


// Déclarations des routes de notre application
app.get('/',(req, res)=>{
    res.send('MongoDB est connecté !');
});

app.get('/user',(req, res) => {
    User.find({}, function(err, data) {
        res.send(data);
    });
});

app.post('/login',(req, res) => {
    User.findOne({email: req.body.email}, (err, data) => {
        if (data) {
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if (result){
                    let token = jwt.sign({id: data._id}, "maclefsecrète");
                    let response = {user:data, token:token};
                    res.status(200).send(response);
                    console.log('Vous êtes connecté avec succès');
                } else{
                    res.status(400).send('error : ' + err);
                    console.log('Mot de passe et ou email érronés');
                }
            })

        }else {
            res.status(404).send('resource non trouvée')
        }
    });
});


app.post('/adduser',(req, res)=> {

    bcrypt.hash(req.body.password,10,(err,hash) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    //Insert Into
    let user = new User(
        {
            name: name,
            email: email,
            password:hash
        }
    );
    // if(name != null && email != null && password != null){
        user.save(function(err, data){
         if (err){
             res.status(400).send(err)
             console.log('Vos champs ne sont pas valide');
            }else {
             res.status(200).send(data)
             console.log('vos données ont été enregistrées avec succès');
         }
    })
    // }
   })
});
app.put('/user',(req,res) => {
    User.updateOne({_id: req.body.id},{$set:{password: req.body.password}},
        function(err, data){
            if(err)
                res.send(err);
            else
                res.send(data);
        }
    )
});
app.delete('/deleteuser',(req,res) => {
    User.deleteOne({_id: req.body.id},
        function(err, data){
            if(err)
                res.send(err);
            else
                res.send(data);
        }
    )
});


//**************************** LIST ****************************//
//**************************************************************
app.get('/list', (req, res) => {
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
    List.find({}, function(err, data){
        res.send(data);
    })
  })
});
app.post('/addList',(req, res)=>{
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
        if (err)
           res.send(err)
        else {
            let list = new List (
                {
                    name:req.body.name,
                    userId: decoded.id,
                }
            )
            list.save(function(err, data){
                if (err){
                    res.status(400).send(err)
                   }else {
                    res.status(200).send("Votre liste a été ajouté avec succès").end();
                }
            })
        }
   })
});
app.put('/updateList',(req,res) => {
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
    List.updateOne({_id: req.body.id},{$set:{name: req.body.name}},
        function(err, data){
            if(err)
                res.send(err);
            else
                res.send(data);
        }
     )
  })
});

app.delete('/deleteList',(req,res) => {
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
    List.deleteOne({_id: req.body.id},
        function(err, data){
            if(err)
                res.send(err);
            else
                res.send(data);
         }
       )
   })
});



//*********************************** TASK ***********************************
//****************************************************************************

app.get('/task', (req, res) => {
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
    Task.find({}, function(err, data){
        res.send(data);
    })
  })
});
app.post('/addTask',(req, res)=>{
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
        if (err)
           res.send(err)
        else {
            let list = new Task (
                {
                    title:req.body.title,
                    listId: decoded.id,
                }
            )
            list.save(function(err, data){
                if (err){
                    res.status(400).send(err)
                   }else {
                    res.status(200).send("Votre tache a été créee avec succès").end();
                }
            })
        }
    })
});
app.put('/updateTask/:id',(req,res) => {
     jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
         User.findOne({_id:decoded.id},function(err, data){

             if (err)
                res.send(err);
            else{
                Task.updateOne({_id: req.params.id},{$set:{title: req.body.title}},
                    function(err, data){
                        if(err)
                            res.send(err);
                        else
                            res.send(data);
                    }
                 )
              }
         })
     })
});

app.delete('/deleteTask/:id',(req,res) => {
    jwt.verify(req.headers["x-access-token"], "maclefsecrète", function(err, decoded){
     User.findOne({_id:decoded.id},function(err, data){

         if (err)
            res.send(err);
        else{
            Task.deleteOne({_id: req.params.id},
                function(err, data){
                    if(err)
                        res.send(err);
                    else
                        res.send(data);
                }
             )
          }
     })
   })
});

// Mise en écoute de notre application (sur le port 3000)
app.listen(3000);
