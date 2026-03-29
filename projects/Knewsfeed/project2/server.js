const PORT = 3000
const express = require("express")
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const cors = require('cors')
app.use(cors())

app.listen(PORT, () => console.log(`server is running on ${PORT}`))


const url = 'https://finance.yahoo.com/'
let dataArr = []
app.use(express.static('knewsfeedVanilla'))

app.get('/index.html', (req, res) => {

   res.status().json('hello')

})

  app.get('/active', (req, res) => {

    axios(url+'most-active').then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      let currData = []
  
      $('.simpTblRow', html).each(function() {
        const symbol = $(this).find('a').text()
        const price = $(this).find('fin-streamer').text()
        const change = $(this).find('fin-streamer').children().text()
  
        
        currData.push([
          symbol,
          price,
          change
        ])

      })

       dataArr = currData
       res.json(dataArr)
    })

  })

  app.get('/trending', (req, res) => {

    axios(url+'trending-tickers').then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      let currData = []
  
      $('.simpTblRow', html).each(function() {
        const symbol = $(this).find('a').text()
        const price = $(this).find('fin-streamer').text()
        const change = $(this).find('fin-streamer').children().text()
  
        
        currData.push([
          symbol,
          price,
          change
        ])

      })

       dataArr = currData
       res.json(dataArr)
    })

  })
