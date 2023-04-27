const fs = require(`fs`);
const { get } = require("http");
const { test } = require("node:test");

export default class ProductManager {

    //VARIABLES PRIVADAS
    #id = 0;
    
    constructor(){
        this.path = `./products.json`
        fs.promises.writeFile(this.path,JSON.stringify([]))
    };

    //MÉTODOS

    /*En el método "getProducts" creo una variable llamada actualProducts, la cual me permite almacenar el array 
    con sus elementos (objetos, en este caso). Dicho array lo traigo del archivo creado, aplicándo JSON.parse*/
    async getProducts(){
        try{
            const actualProducts = await fs.promises.readFile(this.path,`utf-8`)
            return JSON.parse(actualProducts); 
        }
        catch(err){
            console.log(`We could not get the array of products.`)
        }
    };

    /* */
    async addProduct(title, description, price, thumbnail, code, stock = 50){
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,  
            id: this.#getID(),
          };

          try{
            if(title && description && price && thumbnail && code && stock){
                const productArray = await this.getProducts();
                const findCode = await productArray.findIndex(
                    (obj) => obj.code === code
                );
                if (findCode != -1){
                    console.log("The product alredy exists")
                    return;
                };
                await productArray.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(productArray))
            } else {
                console.log("Something went wrong. Fill in every parameter");
            }
          }

          catch(err){
            console.log("It is not possible to add new products.")
          }
    };

    #getID() {
        this.#id++
        return this.#id;
    };

    /*En el método "getProductById" busco un producto (objeto) en el array. Dicho arreglo lo obtengo mediante
    this.getProducts(), guardándolo en la variable foundArray. Luego comienzo a operarlo.*/
    async getProductById(idProduct){
        try{
            const foundArray = await this.getProducts();
            let productIndex = await foundArray.findIndex(
                (product) => product.id == idProduct
            );
            if(productIndex === -1){
                console.log("¡Not Found!");
                return;  
            };
            const product = await foundArray[productIndex]; 
            console.log(product);
        }
        catch(err){
            console.log(`It is not possible to get a product by its Id.`)
        }
    };

    /*En el parámetro "about tengo que escribir un objeto."*/
    async updateProduct(idProduct, about){
        try{
            const newUpdatedProduct = await about;
            const arrayOfProducts = await this.getProducts();
            const oldProduct = await arrayOfProducts.find((product) => product.id === idProduct);
            if(oldProduct == undefined){
                console.log(`The product you are trying to modify, does not exist.`)
                return;
            }
            const mergedProduct = await {...oldProduct,...newUpdatedProduct}; 
            await this.deleteProduct(idProduct);
            arrayOfProducts = await this.getProducts();
            await arrayOfProducts.push(mergedProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(arrayOfProducts))
        }
        catch (err) {
            console.log(`It was not possible to modify the object.`);
        } 
    };

    /* */
    async deleteProduct(idProduct){
        try{
        const arrayUnderStudy = await this.getProducts();
        const indexOfProduct = arrayUnderStudy.findIndex((product) => product.id === idProduct)
        if(indexOfProduct != -1){
            const productToDelete = await arrayUnderStudy[indexOfProduct];
            const arrayFiltered = await arrayUnderStudy.filter((product) => product != productToDelete)
            await fs.promises.writeFile(this.path, JSON.stringify(arrayFiltered))
        }else{
            console.log(`The product does not exist.`)
        }
        }
        catch(err){
            console.log(`We could not delete the product by its id.`)
        }
    };
}



const mates = new ProductManager();

const test1 = async () => {
	// intento
	try {
		// Agregar mate
		await mates.addProduct("Mate","Mate de Plástico", 200,`ruta a definir`, 8, 50);
        await mates.addProduct("Mate","Mate de Vidrio", 350,`ruta a definir`, 7, 50);
        await mates.addProduct("Mate","Mate de Cerámica", 120,`ruta a definir`, 6, 50);
	} catch (err) {
		// Si hay error imprimo el error en consola
		console.log('Something went wrong with test1.');
	}
};

const test2 = async (num) => {
	// intento
	try {
		// Elimino un producto
		await mates.getProductById(num);
	} catch (err) {
		// Si hay error imprimo el error en consola
		console.log('Something went wrong with test2.');
	}
};

const test3 = async () => {
    try{
        console.log(await mates.getProducts());
    }
    catch(err){
        console.log(`Something went wrong with test3.`)
    }
};

const test4 = async (num) => {
    try{
        await mates.deleteProduct(num);
    }
    catch(err){
        console.log(`Something went wrong with test4.`)
    }
};

const test5 = async (idProduct, object) => {
    try{
        await mates.updateProduct(idProduct,object)
    }
    catch{
        console.log(`Something went wrong with test5`)
    }
};

// Ejecuto el test
const executeTest = async () => {
    try{
        await test1();
        console.log(`Done test1`)
        await test3();
        console.log(`Done test3`)
    }
    catch (err) {
        console.log(`Something went wrong with the testings`)
    }
}

executeTest();