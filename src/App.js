// Import PACKAGES
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Contact from './Contact';
import InvoiceList from './InvoiceList';
import Missing from './Missing';
import { 
  BrowserRouter, 
  Routes, 
  Route,
  useNavigate
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { postsAPI, emailAPI, invoicesAPI } from './api/posts';
import easyinvoice from 'easyinvoice';
const qs = require('qs');


function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  // GET Posts from JSON server
  useEffect(() => {
    const fetchPosts = async () => {
      try {
          // AXIOS check automatically if RESPONSE is in 200 range
          const response = await postsAPI.get('/posts');
          setPosts(response.data);
      } catch (err) {
        if (err.response) {
            // Not in the 200 response range
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else {
            console.log(`Error: ${err.message}`);
        }
      }
    }
    fetchPosts();
  }, [])

  // GET Invoices from JSON server
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
          // AXIOS check automatically if RESPONSE is in 200 range
          const response = await invoicesAPI.get('/invoices');
          setInvoices(response.data);
      } catch (err) {
        if (err.response) {
            // Not in the 200 response range
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else {
            console.log(`Error: ${err.message}`);
        }
      }
    }
    fetchInvoices();
  }, [])

  // Search and filter function
  useEffect(() => {
      const filteredResults =posts.filter(post => 
        ((post.body).toLocaleLowerCase()).includes(search.toLocaleLowerCase())
     || ((post.title).toLocaleLowerCase()).includes(search.toLocaleLowerCase())
    );
        setSearchResult(filteredResults.reverse());
  },[posts, search])

  // CREATE NEW Post
  const handleSubmit = async (e) => {
      e.preventDefault();
      const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newPost = { id, title: postTitle, datetime, body: postBody };
      try {
        const response = await postsAPI.post('/posts', newPost)
        console.log(response.data);
        const allPosts = [...posts, response.data];
        setPosts(allPosts);
        setPostTitle('');
        setPostBody('');
        navigate('/');
      } catch (err) {
          console.log(`Error: ${err.message}`);
      }
  }

  // EDIT Post
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await postsAPI.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  // DELETE Post
  const handleDelete = async (id) => {
    try {
      await postsAPI.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate('/');
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }   
  }

  // Send contact Email
  const sendContact = async (e) => {
    e.preventDefault();
    const contact = {
      name: name,
      phone: phone,
      email: email,
      company: company,
      message: message
    };
    try {
      const response = await emailAPI.post('/email', contact);
      setName('');
      setPhone('');
      setEmail('');
      setCompany('');
      setMessage('');
      navigate('/');
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }

  // Create Invoice
  const createInvoice = async (e) => {
    e.preventDefault();
    let data = {
      "sender": {
          "company": "Mares Liviu PFA",
          "address": "Alexandru Cutieru 25A",
          "zip": "1234 AB",
          "city": "Bucuresti",
          "country": "Romania"
          //"custom1": "custom value 1",
          //"custom2": "custom value 2",
          //"custom3": "custom value 3"
      },
      // Your recipient
      "client": {
          "company": "Persoana Fizica",
          "address": "Plaza Romania",
          "zip": "4567 CD",
          "city": "Bucuresti",
          "country": "Romania"
          // "custom1": "custom value 1",
          // "custom2": "custom value 2",
          // "custom3": "custom value 3"
      },
      "information": {
          // Invoice number
          "number": "2022.0001",
          // Invoice data
          "date": "26-12-2022",
          // Invoice due date
          "due-date": "31-01-2023"
      },
      "products": [
          {
              "quantity": 3,
              "description": "Caffe Latte",
              "tax-rate": 19,
              "price": 19
          },
          {
              "quantity": 4,
              "description": "Muffin",
              "tax-rate": 19,
              "price": 14.9
          },
          {
              "quantity": 2,
              "description": "Ice Latte",
              "tax-rate": 19,
              "price": 17.9
          }
      ]
  };
      const result = await easyinvoice.createInvoice(data);
      const id = invoices.length ? invoices[invoices.length - 1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newInvoice = { id, pdf: `${result.pdf}`, datetime, name: `Factura ${id}` };

    try {
      const response = await invoicesAPI.post('/invoices', newInvoice);

      const allInvoices = [...invoices, response.data.pdf];
      setInvoices(allInvoices);
      
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }
  
  // Render App Elements
  return (
    <div className="App">
      <Header title='React JS Blog' />
      {/* <BrowserRouter> */}
        <Routes>
          <Route path='/' 
                  element={
                    <Nav 
                      search={search}
                      setSearch={setSearch}
              />}
          >
          <Route 
                index 
                  element={
                    <Home 
                      posts={searchResult}
              />} 
          />
          <Route path='/post' 
                  element={
                    <NewPost
                       handleSubmit={handleSubmit}
                       postTitle={postTitle}
                       setPostTitle={setPostTitle}
                       postBody={postBody}
                       setPostBody={setPostBody}
              />} 
          />
          <Route path='/edit/:id' 
                  element={
                    <EditPost
                        posts={posts}
                        handleEdit={handleEdit}
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        editBody={editBody}
                        setEditBody={setEditBody}
              />} 
          />
          <Route path='/post/:id' 
                element={
                  <PostPage 
                    posts={posts}
                    handleDelete={handleDelete}
                  />} 
          />
          <Route path='/about' element={<About />} />
          <Route path='/contact' 
                element={
                  <Contact
                    sendContact={sendContact}
                    name={name}
                    setName={setName}
                    phone={phone}
                    setPhone={setPhone}
                    email={email}
                    setEmail={setEmail}
                    company={company}
                    setCompany={setCompany}
                    message={message}
                    setMessage={setMessage}
                  />} 
          />
          <Route path='/invoices' 
                  element={
                    <InvoiceList />} 
          />
          <Route path='*' element={<Missing />} />
          </Route>
        </Routes>
      {/* </BrowserRouter> */}
      <Footer />
    </div>
  );
}

export default App;
