import app from './app.js'
import{PORT} from './config.js'
import{BD_HOST} from './config.js'
app.listen(PORT); //3000
console.log("el servidor esta escuchando: ",PORT)
console.log("el servidor esta escuchando:",BD_HOST)