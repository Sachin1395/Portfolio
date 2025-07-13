
import './App.css';
import './home'
import Home from './home';
import Navbar from './navbar';
import Project from './projects'
import Experience from './exp';
import About from './about';
import Contact from './contact';




function App() {
  return (
    <div className='app-main'>
    <Navbar/>
    <Home/>
    <Project/>

    <Experience/>
    <About/>
    <Contact/>

    </div>
    

  );
}

export default App;
