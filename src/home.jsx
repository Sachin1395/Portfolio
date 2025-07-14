import React from 'react';
import './home.css';
import "@fontsource/instrument-serif";
import ellipse from './assets/Ellipse.png';
import ellipse2 from './assets/Ellipse2.png';


function Home() {

  const handleConnectClick = () => {
    window.open('https://www.linkedin.com/in/sachin1395', '_blank');
  };

  const handleHireClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id='home'>
      <div className='main'>
        {/* <div className='c1'><img src={ellipse} alt="Decorative Shape" /></div>
        <div className='c2'><img src={ellipse2} alt="Decorative Shape" /></div> */}
        <div className='circle1'></div>
        <div className='circle2'></div>
      

        <div className='left'>
          <p className='hello'>Hello Everyone</p>
          <p className='hello'>I am</p>
          <p className='sachin'>Sachin</p>
        </div>

        <div className='right'>
          <div className='quote'>
            <p className='quote-p'>The great growling <br /> engine of change -<br />  Technology</p>
          </div>

          <div className='nav-buttons'>
            <button className='connect' onClick={handleConnectClick}>Connect</button>
            <button className='hire' onClick={handleHireClick}>Hire me</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
