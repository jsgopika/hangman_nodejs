const express =  require('express')
const app = express()

app.use(express.urlencoded({extended:true}))

app.use(express.json())
// Page Server
app.get('/',function(req,res,next){
  res.sendFile('index.html',{root:'./pages'})
})

// Polyfils
const replaceCharAt = (x,i,char)=>x.substring(0, i) + char + x.substring(i+1);

// Game related
const game_const = {
  secret:'nandu',
  allowdAttempts:10,
}

const game_value = {
  tries : 0,
  maskedWord:''
}

function start_game(){
  let { secret } = game_const
  game_value.tries = 0
  game_value.maskedWord =''
  for(let i =0 ;i<secret.length;i++)
    game_value.maskedWord+='*'
}


app.get('/new_game',(req,res,next)=>{
  start_game()
  const response = {
      maskedWord : game_value.maskedWord,
      completed: game_const.secret===game_value.maskedWord || game_value.tries >= game_const.allowdAttempts,
      passed: game_const.secret === game_value.maskedWord,
      remaining : game_const.allowdAttempts - game_value.tries
  }
  res.json(response)
})

app.post('/input',(req,res,next)=>{
  const {char} =  req.body
  
  isCorrect = false
  for(let i = 0;i < game_const.secret.length;i++){
    const c = char[0]
    if(game_const.secret[i] === c){
      game_value.maskedWord= replaceCharAt(game_value.maskedWord,i,c)
      isCorrect = true
    }
  }

  if(!isCorrect){
    game_value.tries++
  }


  const response = {
    maskedWord : game_value.maskedWord,
    completed: game_const.secret===game_value.maskedWord || game_value.tries >= game_const.allowdAttempts,
    passed: game_const.secret === game_value.maskedWord,
    remaining : game_const.allowdAttempts - game_value.tries
  }


  res.json(response)
})


app.listen(8000)