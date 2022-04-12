import fs from 'fs/promises';
import Link from 'next/link';
import path from 'path';
// import tools from '../data/dummuBackend.json';

function HomePage(props) {
  const {products} = props;
  return (
    <ul>
      {products.map(p => <li key={p.id}><Link href={`/${p.id}`}>{p.title}</Link></li>)}
    </ul>
   );
}


//it will be executed by nextjs for us 
//it will not be visible in the client side insted it all happens during build time
//it will pre render the data and  send it as a props.
export async function getStaticProps(){
  const filePath = path.join(process.cwd(),'data','dummuBackend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  // const data = tools.products;

  if(!data){
    return {
      redirect : {
        destination: '/no-data'
      }
    }
  }

  if(data.products.length === 0){
    return {notFound : true};
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  }
}

export default HomePage;