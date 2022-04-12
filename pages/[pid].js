import { Fragment } from "react";
import fs from 'fs/promises';
import path from 'path';

function ProductDetailPage({loadedProduct}){

    if(!loadedProduct){
        return <p>Loading .....</p>
    }
    return (
        <Fragment>
            <h1>{loadedProduct.title}</h1>
            <h1>{loadedProduct.description}</h1>
        </Fragment>
    );
}

async function getData(){
    const filePath = path.join(process.cwd(), 'data', 'dummuBackend.json');
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);

    return data;
}

export async function getStaticProps(context){
    const {params} = context;
    const productId = params.pid;

    const data = await getData();

    const product = data.products.find((product) => product.id === productId);

    return {
        props :{
            loadedProduct : product,
        }
    }
}

//for the dynamic page the getStaticPaths tells the nextjs
//that how many concrete page to pre-render
export async function getStaticPaths(){
    const data = await getData();

    const ids = data.products.map(p => p.id);
    const pathsWithParams = ids.map(id => ({params : {pid: id}}));

    return {
        paths: pathsWithParams,
        // paths: [
        //     {params : { pid : 'p1'}},
        //     {params : { pid : 'p2'}},
        //     {params : { pid : 'p3'}},
        // ],
        fallback: false 
        // we can set true and give the pid's for which we need to pre-render
        //assue there is only p1 , still p2,p3 will render but wont pre-render on server.
    };
}

export default ProductDetailPage;