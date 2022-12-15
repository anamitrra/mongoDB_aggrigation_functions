const express = require(`express`);
const mongoose = require("mongoose");
const {MongoClient} = require(`mongodb`);

mongoose.set('strictQuery', true);

const app = express();



app.listen(3000, ()=>{
    console.log(`Server Started on port 3000...`);
})


const database = `test`;
const url = `mongodb+srv://admin:admin@cluster0.n6y54ik.mongodb.net/?retryWrites=true&w=majority` ;
const client = new MongoClient(url);
async function getData(){
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection(`ads`);
    let searchTerm = "skincare"; //enter search keyword here
    const queryRegx = new RegExp(searchTerm, 'i');
    let response = await collection.aggregate([
      {
        $lookup: {
          from: "company",
          localField: "companyId",
          foreignField: "_id",
          as: "company"
        }
      } , {$unwind: '$company'} ,  
       {$group: {_id: "$_id",
        "primaryText":{"$first": "$primaryText"}, 
        "headline":{"$first":"$headline"},
        "description":{"$first":"$description"},
        "CTA":{"$first":"$CTA"},
        "imageUrl":{"$first":"$imageUrl"},
        "company":{"$first":"$company.name"},
        "url":{$first:"$company.url"}}} , 
        { "$match": {$or:[
          {"headline":{ $regex: queryRegx }},
          {"primaryText" :{ $regex: queryRegx } },
          {"description" :{ $regex: queryRegx } },
          {"company" :{ $regex: queryRegx } }
        ] } },
    ]).toArray();

    console.log(response);
   
}
getData();

