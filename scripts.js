const app = document.getElementById('root')

const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)

const startGame = document.getElementById('start')
startGame.textContent = 'Start !'

const teamdiv = document.getElementById('myteam')
const enemydiv = document.getElementById('enemies')

// random and choosen pokemons for enemy team and my team
var enemies = []
var myTeam = []
var refresh = 0
var enemiesAlive = 6
var myResult = 0
var enemyResult = 0
var winner = ''
var looser = []
var nbmatch = 0

// selection of pokemons in the type fire
var requestFire = new XMLHttpRequest()
requestFire.open('GET', 'https://pokeapi.co/api/v2/type/10', true)
requestFire.onload = function () {
  // variable to count the number of pokemons correspondinf to the type fire
  var count = -1
  // the id of my pokemons
  var teamnb = [4, 26, 53]

  var data = JSON.parse(this.response)

  if (requestFire.status >= 200 && requestFire.status < 400) {
    // I push the name and the type of each of my pokemons in a list
    for (var i = 0; i <= 2; i++) {
      var mypok = data.pokemon[teamnb[i]]
      var mypokemon = {
        type: data.name,
        name: mypok.pokemon.name
      }
      myTeam.push(mypokemon)
    }

    // I count the total number of fire pokemons
    Object.values(data.pokemon).forEach(pokemon => {
      count++
    })

    for (let i = 0; i <= 2; i++) {
      // I randomly select one pokemon
      const j = Math.round(Math.floor(Math.random() * Math.floor(count)))
      var pok = data.pokemon[j]
      var pokemon = {
        type: data.name,
        name: pok.pokemon.name
      }
      // I push its name and type into the enemy list
      enemies.push(pokemon)
    }
  } else {
    console.log('ERROR on fire request')
  }
}

requestFire.send()

// selection of pokemons in the type water
var requestWater = new XMLHttpRequest()
requestWater.open('GET', 'https://pokeapi.co/api/v2/type/11', true)
requestWater.onload = function () {
  // variable to count the number of pokemons correspondinf to the type water
  var count = -1
  // the id of my pokemons
  var teamnb = [13, 54, 21]

  var data = JSON.parse(this.response)

  if (requestWater.status >= 200 && requestWater.status < 400) {
    // I push the name and the type of each of my pokemons in a list
    for (var i = 0; i <= 2; i++) {
      var mypok = data.pokemon[teamnb[i]]
      var mypokemon = {
        type: data.name,
        name: mypok.pokemon.name
      }
      myTeam.push(mypokemon)
    }

    // I count the total number of pokemons
    Object.values(data.pokemon).forEach(pokemon => {
      count++
    })

    for (let i = 0; i <= 2; i++) {
      // I randomly choose one pokemon
      const j = Math.round(Math.floor(Math.random() * Math.floor(count)))
      var pok = data.pokemon[j]
      var pokemon = {
        type: data.name,
        name: pok.pokemon.name
      }
      // I push its name and type into the enemy list
      enemies.push(pokemon)
    }
  } else {
    console.log('ERROR on water request')
  }
}

requestWater.send()

startGame.onclick = function () {
  // if the game is ended the page reload if we want to start a new game
  if (nbmatch > 0) {
    refresh = 0
    document.location.reload()
  } else if (refresh === 0) {
    refresh = 1
    // I display my number of matches
    const matches = document.getElementById('nbMatch')
    matches.textContent = 'Match n°' + nbmatch
    // display my team of pokemons
    var i = 1
    var j = 1
    const myScore = document.getElementById('myScore')
    myScore.textContent = 'Result: ' + myResult
    Object.values(myTeam).forEach(pokemon => {
      const button = document.createElement('button')
      button.style.background = 'rgb(10, 94, 172)'
      button.textContent = pokemon.name + ' - ' + pokemon.type
      button.setAttribute('id', 'myteam' + i)
      button.onclick = function () { choseAndFight(pokemon) }
      teamdiv.appendChild(button)
      i++
    })
    // display the enemy team
    const enemyScore = document.getElementById('enemyScore')
    enemyScore.textContent = 'Result: ' + enemyResult
    Object.values(enemies).forEach(pokemon => {
      const button2 = document.createElement('button')
      button2.style.background = 'rgb(252, 85, 85)'
      button2.textContent = pokemon.name + ' - ' + pokemon.type
      button2.setAttribute('id', 'enemy' + j)
      button2.setAttribute('disabled', true)
      enemydiv.appendChild(button2)
      j++
    })
  }
}

function choseAndFight (pokemon) {
  nbmatch++
  const matches = document.getElementById('nbMatch')
  matches.textContent = 'Match n°' + nbmatch

  // if the game is ended, the buttons are disabled and become white
  if (nbmatch === 5) {
    for (var i = 1; i <= 6; i++) {
      const button = document.getElementById('myteam' + i)
      button.setAttribute('disabled', true)
      button.style.background = 'white'

      const button2 = document.getElementById('enemy' + i)
      button2.setAttribute('disabled', true)
      button2.style.background = 'white'
    }
  }

  // random number to pick a random enemy
  var j = Math.round(Math.floor(Math.random() * Math.floor(enemiesAlive - 1)))
  while (enemies[j].name === undefined) {
    j = Math.round(Math.floor(Math.random() * Math.floor(enemiesAlive - 1)))
  }

  // display who is fighting
  const text = document.getElementById('myPoke')
  text.textContent = pokemon.name
  const vs = document.getElementById('VS')
  vs.textContent = 'VS'
  var enemy = enemies[j]
  const text2 = document.getElementById('enemyPoke')
  text2.textContent = enemy.name

  looser = []
  // calculate the score and find the winner (will be displayed with displayResult())
  if (pokemon.type !== enemy.type) {
    if (pokemon.type === 'water') {
      myResult += 3
      enemyResult -= 1
      winner = 'The winner is ' + pokemon.name
      looser.push(['enemy', enemy])
    } else {
      myResult -= 1
      enemyResult += 3
      winner = 'The winner is ' + enemy.name
      looser.push(['myteam', pokemon])
    }
  } else {
    winner = 'DRAW'
  }
  // call for the next function and sleep for a sec
  setTimeout(isFighting, 1000)
}

// function to say the pokemons are fighting
function isFighting () {
  const text = document.getElementById('myPoke')
  text.textContent = ''
  const vs = document.getElementById('VS')
  vs.textContent = 'fighting...'
  const text2 = document.getElementById('enemyPoke')
  text2.textContent = ''

  // call for the next function and sleep for a sec
  setTimeout(displayResult, 1000)
}

// function to give the result
function displayResult () {
  // give the name of the winning pokemon
  const vs = document.getElementById('VS')
  vs.textContent = winner
  // update the results of each team
  const myScore = document.getElementById('myScore')
  myScore.textContent = 'Result: ' + myResult
  const enemyScore = document.getElementById('enemyScore')
  enemyScore.textContent = 'Result: ' + enemyResult

  var i = 0
  if (looser.length !== 0) {
    if (looser[0][0] === 'enemy') {
      i = 0
      while (looser[0][1].name !== enemies[i].name) {
        i++
      }
      enemies[i] = [null, null]
      var j = i + 1
      const buttonlooser = document.getElementById('enemy' + j)
      buttonlooser.setAttribute('disabled', true)
      buttonlooser.style.background = 'white'
    } else if (looser[0][0] === 'myteam') {
      i = 0
      while (looser[0][1].name !== myTeam[i].name) {
        i++
      }
      var k = i + 1
      const buttonlooser = document.getElementById('myteam' + k)
      buttonlooser.setAttribute('disabled', true)
      buttonlooser.style.background = 'white'
    }
  }

  // if the game is ended, call for the next function and sleep for a sec
  if (nbmatch === 5) {
    setTimeout(displayFinalResult, 1000)
  }
}

// function to display the final result
function displayFinalResult () {
  if (myResult > enemyResult) {
    const vs = document.getElementById('VS')
    vs.textContent = 'You won !'
  } else if (myResult < enemyResult) {
    const vs2 = document.getElementById('VS')
    vs2.textContent = 'You lost...'
  } else {
    const vs3 = document.getElementById('VS')
    vs3.textContent = 'DRAW'
  }
}
