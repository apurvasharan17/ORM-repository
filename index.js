const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

let {track}=require('./models/track.model');
let {sequelize}=require('./lib/index')

let movieData=
[
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 4,
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2018,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3,
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Ghoshal',
    album: 'Padmaavat',
    duration: 3,
  },
  {
    name: 'Bekhayali',
    genre: 'Rock',
    release_year: 2019,
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 6,
  },
  {
    name: 'Hawa Banke',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Darshan Raval',
    album: 'Hawa Banke (Single)',
    duration: 3,
  },
  {
    name: 'Ghungroo',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'War',
    duration: 5,
  },
  {
    name: 'Makhna',
    genre: 'Hip-Hop',
    release_year: 2019,
    artist: 'Tanishk Bagchi',
    album: 'Drive',
    duration: 3,
  },
  {
    name: 'Tera Ban Jaunga',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Tulsi Kumar',
    album: 'Kabir Singh',
    duration: 3,
  },
  {
    name: 'First Class',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 4,
  },
  {
    name: 'Kalank Title Track',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 5,
  },
]



app.get("/seed_db",async(req,res)=>{
  try{
    await sequelize.sync({force:true})
    await track.bulkCreate(movieData);

    res.status(200).json({message:"Database Seeding successfull"})
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
})

async function fetchAllTracks(){
  let tracks=await track.findAll()
  return {tracks}
}



app.get("/tracks",async (req,res)=>{
  try{
    let response= await fetchAllTracks()
    if(response.tracks.length===0){
      return res.status(404).json({message:"No Tracks Found"})
    }
    return res.status(200).json(response);
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
async function fetchTrackById(id){
 let trackData=await track.findOne({where:{id}});

 return {track:trackData}
}
app.get("/tracks/details/:id",async(req,res)=>{
  try{
    let id=parseInt(req.params.id)
    let result=await fetchTrackById(id);
    console.log(result)

    res.status(200).json(result)
  }catch(err){
    res.status(500).json({error:err.message});
  }
})

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

async function fetchTrackByArtist(artist){
  let tracks=await track.findAll({where:{artist}})
  return ({tracks:tracks})
}
app.get("/tracks/artist/:artist",async (req,res)=>{
  try{
    let artist=req.params.artist;
    let result=await fetchTrackByArtist(artist)
    if(result.tracks.length===0){
      return res.status(404).json({message:"Track Not Found"})
    }
    return res.status(200).json(result)
  }catch(err){
    res.status(500).json({error:err.message});
  }
})
async function sortTrackByReleaseYear(orderedData){
  let sortedTrack=await track.findAll({order:[["release_year",orderedData]]})
  return {tracks:sortedTrack};
}
app.get("/tracks/sort/release_year",async (req,res)=>{
  try{
    let orderedData=req.query.orderedData
    let result=await sortTrackByReleaseYear(orderedData)
    if(result.tracks.length===0){
      return res.status(404).json({message:"No Tracks FOund"})
    }
    return res.status(200).json({result})
  }
  catch(err){
    return res.status(500).json({error:err.message});
  }
})











app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
