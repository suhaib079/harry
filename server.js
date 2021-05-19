'use strict';

// apliction ///

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodoverride = require('method-override');
 const cors =require('cors');
// const { delete } = require('superagent');
// const { application } = require('express');


 // invrmental //

 require('dotenv').config();
 const PORT = process.env.PORT
 const DATABASE_URL = process.env.DATABASE_URL


 //application//

 const server = express();
const client= new pg.Client(DATABASE_URL)
 server.use(express.urlencoded({extended: true}))
 server.use(express.static('./public'))
 server.use(methodoverride('_method'))
 server.set('view engine','ejs')
 server.use(cors())


 //routes

 server.get('/',renderhomepage);
 server.post('/my-fav',getTheDATATODB);
 server.get('/my-fav',renderFromDatabase);
 server.get('/character/:character_id', viewDetails);
 server.put('/character/:character_id', updateCharacter);
 server.delete('/character/:character_id', deletecharacter);

 function deletecharacter(req,res){
     const id =req.params.character_id;
     const sql = `DELETE FROM rahaf WHERE id=$1`;
 const safeValues=[id];
 client.query(sql, safeValues).then(()=>{
     res.redirect('/my-fav')
 })
 }
 


 function updateCharacter(req, res){
     const id= req.params.character_id;
     const sql = `UPDATE rahaf SET name=$1, image=$2, house=$3, patronus=$4, alive=$5, created_by=$6 WHERE id=$7`;
     const {name, image, house, patronus, alive}=req.body;
     const safeValues=[name, image, house, patronus, alive,'api', id ];

     client.query(sql,safeValues).then(() =>{
         res.redirect(`/character/${id}`)
     })
 }

function viewDetails(req, res){
    const id=req.params.character_id;
    const sql=`SELECT * FROM rahaf WHERE id=$1;`;
    const safeValues=[id];

    client.query(sql,safeValues).then(data =>{
        res.render('detials',{suhaib:data.rows})
    })
}










 function renderFromDatabase(req, res){
     const sql=`SELECT * FROM rahaf;`
     client.query(sql).then(data=>{
         res.render('favorite',{suhaib:data.rows} )
     })
    }


 function getTheDATATODB(req,res){
const {name, image, house, patronus, alive}=req.body;
    const sql=`INSERT INTO rahaf (name,image,house,patronus,alive, created_by) VALUES ($1, $2, $3,$4,$5,$6);`
const safeValues=[name, image, house, patronus, alive, 'api'];

client.query(sql,safeValues).then(()=>{
    res.redirect('/my-fav')
})


 }

 
function renderhomepage(req,res){

    const url=`http://hp-api.herokuapp.com/api/characters`
    superagent.get(url).then(results=>{
       const wife= results.body.map(data =>{
        return new Harrypotter(data)

       })
       res.render('index',{suhaib:wife })
    })

}

function Harrypotter (datainfo){
    this.name=datainfo.name;
    this.house=datainfo.house;
    this.patronus=datainfo.patronus;
    this.alive=datainfo.alive;
    this.image=datainfo.image;
}
























 client.connect().then(()=>{
     server.listen(PORT,()=>{
         console.log(`HI ${PORT}`);
     })
 })