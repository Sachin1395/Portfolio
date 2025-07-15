import './about.css';
import myImage from './assets/Picsart_25-07-02_16-35-57-398.jpg';

function About() {
  return (
    <div id="about" className="about-main">
      <div className="gradient-bg"></div>

      <div className="hero">
        <p className="title">About</p>
        <div className="content">
          <div className="image">
            <img src={myImage} alt="Sachin" className="profile-image" />
          </div>
          <div className="about-content">
            <p>
              👋 Hey there, I’m Sachin!<br /><br />
              I’m a curious human running on Python, Java, some oranges, and a dangerously long list of side quests,
              some in code, some in fields or some in video games.<br /><br />
              By day, I’m a CSE student at VIT Chennai, wrangling AI models, dodging semicolons, and negotiating
              data privacy terms with my Smart Grid (she’s moody, but secure thanks to AES-RSA ).<br /><br />
              By night, I switch from debugging code to dribbling past defenders on the football field —
              both require precision, after all.
            </p><br />
            <div className="build-worlds">
              <p>
                I don’t just build apps — I build worlds:<br />
                 • A Secured Smart City data sharing system with AES-RSA encryption, protecting critical infrastructure end-to-end <br />
                • A contract farming platform that ensures fair, direct trade between farmers and buyers <br />
                • An AI-powered storytelling engine where plot twists are generated from comment section chaos powered by drama + NLP <br /><br />
                When I’m not playing with bytes or boots, I’m ideating my next hackathon win, building productivity tools with flair,
                or explaining to NPCs why AI is not gonna take our jobs.
                Welcome to my digital dojo - where tech meets storytelling and every project is just one breakpoint away from greatness.<br /><br />
                Let’s connect, before I respawn into another GitHub repo or open-world adventure ! 
              </p> 
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-wrapper">
        <div className="achievements-scroll">
          <div className="achievement">
            <h2>Hackathon Winner</h2>
            <p>1st place in App Marvel, an intra-college hackathon at TechnoVIT’23 by building a android app using flutter.</p>
          </div>
          <div className="achievement">
            <h2>VITSIH Hackathon</h2>
            <p>Top 120 out of 540 teams at VITSIH Hackathon 2024 with the Assured Contract Farming System.</p>
          </div>
          <div className="achievement">
            <h2>Best Paper Award</h2>
            <p>My team was awarded the best paper award for AI-Powered Traffic Signals and Street Lights' at International SCES 2024.</p>
          </div>
          <div className="achievement">
            <h2>Best Prototype</h2>
            <p>1st prize in Quality Week 2024 Project Expo for Sustainable Models/Prototypes for Future Smart Cities.</p>
          </div>
          <div className="achievement">
            <h2>Book Chapter</h2>
            <p> Contributed to a book chapter on "Critical Infrastructure Protection: Difficulties with Cyber-Physical System
 Stability, Security, Privacy, and Forensics," scheduled for publication in 2025.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
