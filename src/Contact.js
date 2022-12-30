const Contact = ({
    sendContact,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    company,
    setCompany,
    message,
    setMessage
}) => {
return (
  <main className="Contact">
      <h2>Contact</h2>
      <form className="contactForm" onSubmit={sendContact}>
            <label htmlFor="name">Name:</label>
            <input 
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)} 
            />
            <label htmlFor="phone">Phone:</label>
            <input 
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
            />
            <label htmlFor="email">Mail:</label>
            <input 
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
            <label htmlFor="company">Company:</label>
            <input 
                id="company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)} 
            />
            <label htmlFor="message">Message:</label>
            <textarea 
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Submit</button>
      </form>
  </main>  
)
}

export default Contact