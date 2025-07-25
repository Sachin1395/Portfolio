import React, { useState } from "react";
import './projects.css';
import { FaGithub, FaLinkedin, FaExternalLinkAlt } from "react-icons/fa";

function ProjectCard({ titleClass, nameClass, bulletClass, name, desc, github, linkedin, deploy }) {
    const [showInfo, setShowInfo] = useState(false);

    const handleToggle = () => {
        // Only toggle on small screens
        if (window.innerWidth <= 600) {
            setShowInfo(!showInfo);
        }
    };

    return (
        <div className={`block project ${titleClass}`} onClick={handleToggle}>
            <div className={`hover-info ${showInfo ? 'show' : ''}`}>
                <a href={github} target="_blank" rel="noreferrer"><FaGithub /></a>
                <a href={linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>
                <a href={deploy} target="_blank" rel="noreferrer"><FaExternalLinkAlt /></a>
            </div>
            <p className={`project-lname-${titleClass.slice(-1)} project-desc`}>{desc}</p>
            <div className={`title-${titleClass.slice(-1)} title-font`}>
                <div className={`bullet-${titleClass.slice(-1)}`}></div>
                <p className={nameClass}>{name}</p>
            </div>
        </div>
    );
}

function Project() {
    return (
        <div id="projects" className="projects">
           
            <p className="title-p">Projects</p>

            <div className="row-1">
                <ProjectCard
                    titleClass="project-1"
                    nameClass="project-name-1"
                    bulletClass="bullet-1"
                    name="Secure Data Exchange for Smart Cities"
                    desc="A privacy-preserving system for secure data sharing between smart city services."
                    github="https://github.com/Sachin1395/Secure_Data_Exchange"
                    linkedin="https://www.linkedin.com/posts/sachin1395_smartcities-cybersecurity-securedata-activity-7255954874943602688-fuLv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEcTx2cBGiag--RbSZF8cWOcst0DVGTNiDQ"
                    
                />
                <ProjectCard
                    titleClass="project-2"
                    nameClass="project-name-2"
                    bulletClass="bullet-2"
                    name="AgreeDeal"
                    desc="Escrow-backed contract farming platform between farmers and consumers."
                    github="https://github.com/Sachin1395/Agreedeal"
                    linkedin="https://www.linkedin.com/posts/sachin1395_hackathon2024-innovationchallenge-contractfarming-activity-7240382878105096194-IDTW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEcTx2cBGiag--RbSZF8cWOcst0DVGTNiDQ"
                    // deploy="https://your-deployment-link2.com"
                />
            </div>

            <div className="row-2">
                <ProjectCard
                    titleClass="project-3"
                    nameClass="project-name-3"
                    bulletClass="bullet-3"
                    name="Narratives in Motion"
                    desc="AI-driven interactive storytelling that adapts to user engagement."
                    github="https://github.com/Sachin1395/Narratives-in-Motion-draft-1"
                    // linkedin="https://linkedin.com/in/sachin1395"
                    // deploy="https://your-deployment-link3.com"
                />
                <ProjectCard
                    titleClass="project-4"
                    nameClass="project-name-4"
                    bulletClass="bullet-4"
                    name="AI Video Object Detection Platform"
                    desc="Deep learning-based object detection in user-uploaded videos."
                    github="https://github.com/Sachin1395/Object-Detection"
                    // linkedin="https://linkedin.com/in/sachin1395"
                    // deploy="https://your-deployment-link4.com"
                />
                <ProjectCard
                    titleClass="project-5"
                    nameClass="project-name-5"
                    bulletClass="bullet-5"
                    name="ML Algorithms"
                    desc="Linear and Logistic Regression from scratch without ML libraries."
                    // github="https://github.com/Sachin1395/ML-from-scratch"
                    // linkedin="https://linkedin.com/in/sachin1395"
                    // deploy="https://your-deployment-link5.com"
                />
            </div>
        </div>
    );
}

export default Project;
