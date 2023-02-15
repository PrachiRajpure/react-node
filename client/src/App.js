import React, {useState} from 'react'
import {Button, Card, CardContent, Grid, Typography} from '@mui/material'

function App(){


  const [message, setMessage] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    var input = document.getElementById('files')
    var data = new FormData()
    if(input.files.length>0){
      setMessage("Uploading");
      for (const file of input.files) {
        data.append('files',file,file.name)
      }
      console.log(data.keys().next())
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: data
      })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.response_message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }else{
      setMessage("Please select atleast one file");
    }
  }

  
  const handleFileChange = event => {
    var input = document.getElementById('files')  
    setMessage(input.files.length+ " files selected");
  }

  

  return (
    <div className='App'>
      <Typography gutterBottom variant='h3' align='center'>
        Upload File Here
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                component="label">
                Select File
                <input
                  id='files'
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  accept='.json,.mp4'
                />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                color="success">
                Upload File
              </Button>
            </Grid>

            
            <Grid item>
              <Button
                variant="contained"
                type="button"
                onClick={(e)=>{
                  e.preventDefault();
                  window.location.href='http://localhost:5000/list';
                }
                }
                color="secondary">
                List Files
              </Button>
            </Grid>
            
            <Grid item>
      
              <Typography
                color="red"
                variant='h4'
                gutterBottom align='center'>
                {message}
              </Typography>
            </Grid>
            
          </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default App