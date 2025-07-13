import './contact.css';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");
    const form = new FormData();
    
    form.append("access_key", "2bd9e426-52ae-45a0-82ed-6446c6e00c7c"); // Replace with your Web3Forms access key
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("message", formData.message);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: form
    });

    const data = await response.json();

    if (data.success) {
      setResult("Message sent successfully!");
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } else {
      console.log("Error", data);
      setResult("Something went wrong.");
    }
  };

  return (
    <div id='contact' className="contact-main">
      <p className="contact-title">Contact Me</p>
      <p className="contact-sub">Have a question, project, or opportunity in mind? Let's connect!</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Send Message</button>
      </form>

      {result && <p className="thank-you">{result}</p>}
    </div>
  );
}

export default Contact;
