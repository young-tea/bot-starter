//express
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const store = require('store2')
var ls = require('local-storage');
var path = require('path')



// apps
const apps = require('./modules/apps.json')
const wallets = require('./modules/wallets.json')

const port = 3000

const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'youngteaisawesome',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, expires: false }
}))

// setting view engine & assets folder
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')));

// cookies (favorites list)
app.post('/add-fav', (req, res) => {
  // getting product id and assigning to variable
  const appID = req.body.appId

  // checking if array with items exsists, if yes pushes productId to it, if no, creates it and then pushes
  if (req.session.favApps && req.session.favApps.length > 0) {
    req.session.favApps.push(appID)
    store.clear()
    store.set('favs' , req.session.favApps)
    //ls.remove('favs')
    //ls.set('favs', req.session.favApps)
  } else {
    req.session.favApps = []
    req.session.favApps.push(appID)
    //ls.remove('favs')
    //ls.set('favs', req.session.favApps)
    store.clear()
    store.set('favs' , req.session.favApps)
  }

  res.redirect('/airdrops')
})

app.get('/favorites', (req, res) => {

  // getting array of favorites
  const favs = store.get('favs')
  const toFilter = apps.airdrops
  var dispItems = []

  // checking if there is items in cart, else sending no items
  if(favs) {

    //finding products from ids, then sending them
    favs.forEach(element => {
      function findFav(value) {
        return value.id === element
      }
      var app = toFilter.filter(findFav)
      dispItems.push(app)
    });

    res.render('favorites', {dispItems: dispItems})

  } else {
    res.render('favorites', {dispItems: []})
  }
  
})

// main
app.get('/', (req, res) => {
  console.log("pispis")
  return res.render('index')
})

// airdrop
app.get('/airdrops', (req, res) => {
  return res.render('airdrops', {apps: apps})
})

// wallet
app.get('/wallets', (req, res) => {
  return res.render('wallets', {wallets: wallets})
})

// 404
app.use((req, res) => {
  return res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`listenning to ${port}...`)
})

module.exports = app
