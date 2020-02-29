const builtOn = what=>
  fetch(`https://min-api.cryptocompare.com/data/all/coinlist?builtOn=${what}`)
   .then( r=> r.json() )

const fetchPrice = list=>
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${list}&tsyms=USD`)
    .then( r=> r.json() )
    .then( json=>
      Object.keys(json).map( k=> eths.Data[k] && (eths.Data[k].Prices = json[k]) )
     )

const fetchBy50 = async list=> {
	limit = list.slice(0,50)
	rest = list.slice(50)
	await fetchPrice(limit)
  console.log('fetched 50, rest', rest.length)
  render()
	rest.length && await fetchBy50(rest)
}

const runERC20 = async ()=> {
  console.log('get Ethereum tokens list')
  eths = await builtOn('ETH')
  eths.Data.ETH = {}
  names = Object.keys( eths.Data )
  console.log('token found', names.length)
  await fetchBy50( names )
}
const render = ()=> {
  var p = names
          .map( k=> eths.Data[k] )
          .filter( t=> t.Prices )
      ,t = p.length
      ,v = p.reduce( (t,i)=> t + i.Prices.USD, 0 )
 console.log('priced tokens',t,'total value',v)
  document.querySelector('t').textContent = t
  document.querySelector('v').textContent = Math.round(v)
  document.querySelector('#main_content').innerHTML = p.map( tok=> 
	`<img src="https://cryptocompare.com${tok.ImageUrl}" width="46" title="${tok.FullName}\n${tok.Prices.USD} USD">`
	).join('')
}

var eths = {}, names = []

