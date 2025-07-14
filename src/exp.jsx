import './exo.css';
import Exp from './typewriter';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    icon: 'azure.png',
    date: 'June 2025',
    title: 'Azure AI Associate Engineer',
    desc: 'I worked on building and deploying intelligent solutions using Azure’s AI services like Cognitive Services, Azure Machine Learning, and LUIS. I developed and integrated models for vision, language, and speech tasks, deployed them via APIs, and ensured scalability and security on the cloud. This experience deepened my skills in cloud-based AI development and responsible AI practices.',
    type: 'type1',
  },
  {
    icon: 'aiml.png',
    date: 'September 2024',
    title: 'AI/ML Trainee at SpectoV',
    desc: 'Developed an AI-driven system for real-time object detection in videos, enhancing accuracy and performance. Built a Flask-based web app enabling video uploads, detection processing, and result downloads. Automated LinkedIn recruitment workflows using Selenium and resume analysis tools. Additionally, streamlined new joinee enrollment by automating data updates and sending personalized onboarding emails.',
    type: 'type2',
  },
  {
    icon: 'research.png',
    date: 'Ongoing',
    title: 'Research and Development Intern VIT Chennai',
    desc: 'Led the development of a secure data-sharing system for smart city services, enhancing privacy and reducing integration time by 30% through a Flask-based web application and REST APIs. Improved inter-service communication efficiency, cutting latency by 25%. Additionally, contributed to the deployment of machine learning models in tidal energy systems to optimize energy output predictions and improve operational efficiency.',
    type: 'type3',
  },
  {
    icon: 'iot.png',
    date: 'January 2024',
    title: 'Research Intern, ISACA Chennai Chapter',
    desc: 'Researched IoT security challenges and evaluated protocols across 100+ devices, identifying key vulnerabilities. Formulated actionable security recommendations and presented findings to both academic and professional audiences, contributing to improved IoT resilience and awareness.',
    type: 'type1',
  },
];

function Experience() {
  const timelineRef = useRef([]);

  useEffect(() => {
    // Only animate if screen width is above 786px
    if (window.innerWidth > 786) {
      timelineRef.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  return (
    <div id="experience" className="main-exp">
      <p className="title-p">Experience</p>
      <Exp />

      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            ref={(el) => (timelineRef.current[index] = el)}
            className={`timeline__event timeline__event--${event.type}`}
          >
            <div className="timeline__event__icon">
              <img
                src={`/assets/logos/${event.icon}`}
                alt={event.title}
                className="timeline-icon-img"
              />
            </div>
            <div className="timeline__event__date">{event.date}</div>
            <div className="timeline__event__content">
              <div className="timeline__event__title">{event.title}</div>
              <div className="timeline__event__description">
                <p>{event.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experience;
