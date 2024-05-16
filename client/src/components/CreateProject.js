import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';

const CreateProject = ({ showModal, handleVisibility, reloadPage, props }) => {
  const [title, setTitle] = useState('');
  const [values, setValues] = useState([]);
  const { username: userName = "" } = props || {};

  const createNewProject = async () => {
    try {
      const response = await axios.post('https://todosnode-backend.netlify.app/.netlify/functions/app/create', {
        createdBy: userName,
        title,
      });
      handleVisibility(false);
      setValues([...values, response.data]);
      reloadPage();
      alert('Project created successfully');
      console.log('Project created successfully:', response.data);
    } catch (error) {
      alert(error.response?.data?.message);
      console.error('Error creating project:', error);
    }
  };

  const setVisibility = () => {
    handleVisibility(!showModal);
  }

  return (
    <Modal show={showModal} onHide={setVisibility} size='md'>
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title className='modalTitle'>New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody" >
        <Form className="modalForm" action="">
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input type="email" value={title} className="form-control" id="teacherEmail" placeholder="Enter project name" onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="userEmail">Created By:</label>
            <input type="email" value={userName} className="form-control" id="teacherEmail" placeholder={userName} readOnly />
          </div>
        </Form>
        <Modal.Footer className='modalFooter'>
          <span><button type="button" className="btn btn-primary" onClick={createNewProject}>Create</button></span>
          <span><button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={setVisibility}>Cancel</button></span>
        </Modal.Footer>
      </Modal.Body>
    </Modal >
  );
};

export default CreateProject;
