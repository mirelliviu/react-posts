
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import easyinvoice from 'easyinvoice';
import { invoicesAPI } from './api/posts';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const renderContainer = useRef(null);
  
    useEffect(() => {
      // Make a request to the EasyInvoice API to retrieve the list of invoices
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
    }, []);
  
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedInvoice(null);
    };
  
    const handleShowModal = invoice => {
      setSelectedInvoice(invoice);
      setShowModal(true);
    };

    const renderInvoice =  (pdf) => {
      let container = document.querySelector('#render');
       easyinvoice.render(container, pdf);
    }
  
    return (
      <div>
        <h1>Invoice List</h1>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.name}</td>
                <td>{invoice.datetime}</td>
                <td>
                  <button onClick={() => handleShowModal(invoice.pdf)}>
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            
              {selectedInvoice && renderInvoice(selectedInvoice)}
            
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  export default InvoiceList;
  