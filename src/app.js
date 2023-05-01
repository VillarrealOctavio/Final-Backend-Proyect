//Importo express y lo guardo en una variable.
import express from 'express';

//Importo la clase Product Manager.
import ProductManager from "./productManager.js";

//Creamos la aplicación
const app = express();

//Creamos una instancia de la clase ProductManager
const productManager = new ProductManager();

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

 


// Definimos el metodo Get para la ruta /products
app.get('/products', async (req, res)=>{
    try{
        // Obtenemos el límite de la query
        const limit = await req.query.limit;
        const allProducts = await productManager.getProducts()
        if (limit) {
            res.send(await allProducts.slice(0, limit))
        }else{
            return res.send(productManager.getProducts())
        }

    }
    catch (err) {
        res.send(`Something went wrong with req.query. Take a look to the error: ${err}`)
    }
});




// Definimos el metodo Get para la ruta /products/:pid
app.get('/products/:pid', async (req, res)=>{
    try{
        //Guardamos en una variables todos los productos
        const allProducts = await productManager.getProducts();
        // Buscamos el producto por id
	    let foundProduct = await allProducts.find((product) => {
		return product.id === req.params.id;
	    });
	    // Enviamos la respuesta
	    res.send(foundProduct);
    }
    catch (err) { 
        // Si hay un error, lo envio
		res.send(err);
    }
});




// Escuchamos el puerto 8080
app.listen(8080, () => {
	console.log('I am listening to 8080 server.');
});


