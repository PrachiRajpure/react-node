const express = require("express")
const app = express()
const cors = require('cors');
const fileupload = require("express-fileupload");


app.use(cors())
app.use(fileupload());
const AWS = require('aws-sdk');

AWS.config.update({
    region: "ap-south-1"
});
const s3 = new AWS.S3();
            

app.post("/upload", async (req, res)=>{
    
    var files = req.files.files;
    if(files.length===undefined){
        files = [files]
    }
    for(var i=0;i<files.length;i++){
        console.log(files[i].mimetype);
        var total = 0;
        var uploaded = 0;
        if(files[i].mimetype=="application/json"){
            console.log(files[i].data.toString('utf8'));
        }else if(files[i].mimetype.startsWith("video")){
            total++;
            const fileContent  = Buffer.from(files[i].data, 'binary');
            const params = {
                Bucket: 'prachirajpure',
                Key: files[i].name,
                Body: fileContent
            };
            try {
                const stored = await s3.upload(params).promise()
                console.log(stored);
                uploaded++;
              } catch (err) {
                console.log(err)
            }
        }
    }
    res.send({
        "response_code": 200,
        "response_message": "Total Videos: "+total+" Uploaded Videos: "+uploaded
    });
})

app.get("/list", (req, res)=>{
    var params = {
        Bucket: 'prachirajpure', 
      };
      s3.listObjectsV2(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else{
            var arr = [];
            var files = data.Contents;
            for(var i=0;i<files.length;i++){
                arr.push({
                    name : files[i].Key,
                    url: "https://prachirajpure.s3.ap-south-1.amazonaws.com/"+encodeURI(files[i].Key)
                });
            }
            res.send(arr);
      }
    });
})

app.listen(5000, ()=>{console.log("Server Started")})