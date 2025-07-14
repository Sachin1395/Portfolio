import './about.css';
import myImage from './assets/Picsart_25-07-02_16-35-57-398.jpg';

function About() {
  return (
    <div id="about" className="about-main">
      <div className="hero">
        <p className="title">About</p>
        <div className="content">
          <div className="image">
            <img src={myImage} alt="Sachin" className="profile-image" />
          </div>
          <div className="about-content">
            <p>
              👋 Hey there, I’m Sachin!<br /><br />
              I’m a curious human running on Python, some oranges, and a dangerously long list of side quests,
              some in code, some in fields or some in video games.<br /><br />
              By day, I’m a CSE student at VIT Chennai, wrangling AI models, dodging semicolons, and negotiating
              data privacy terms with my Smart Grid (she’s moody, but secure thanks to AES-RSA ).<br /><br />
              By night, I switch from debugging code to dribbling past defenders on the football field —
              both require precision, after all.
            </p><br />
            <div className="build-worlds">
              <p>
                I don’t just build apps — I build worlds:<br />
                • A Secured Smart City data sharing system with AES-RSA encryption, protecting critical infrastructure end-to-end 🔐<br />
                • A contract farming platform that ensures fair, direct trade between farmers and buyers 🌾<br />
                • An AI-powered storytelling engine where plot twists are generated from comment section chaos powered by drama + NLP 🎭🤖<br /><br />
                When I’m not playing with bytes or boots, I’m ideating my next hackathon win, building productivity tools with flair,
                or explaining to NPCs why AI is not gonna take our jobs.<br /><br />
                Welcome to my digital dojo — where tech meets storytelling and every project is just one breakpoint away from greatness.<br /><br />
                Let’s connect — before I respawn into another GitHub repo or open-world adventure. 🎮🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-wrapper">
        <div className="achievements-scroll">
          <div className="achievement">
            <h2>Hackathon Winner</h2>
            <p>Secured 1st place at App Marvel with a smart AI-driven platform.</p>
          </div>
          <div className="achievement">
            <h2>Smart City Encryption</h2>
            <p>Built a smart grid data protection system using hybrid AES-RSA encryption.</p>
          </div>
          <div className="achievement">
            <h2>Contract Farming System</h2>
            <p>Designed a platform connecting farmers and consumers with escrow smart contracts.</p>
          </div>
          <div className="achievement">
            <h2>AI Internship at SpectoV</h2>
            <p>Built meta-character–driven interview simulations with LLM-based performance feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
