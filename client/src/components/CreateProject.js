import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';

import '../styles.css';

const CreateProject = ({ showModal, handleVisibility, reloadPage, props }) => {
  const [title, setTitle] = useState('');
  const [values, setValues] = useState([]);
  const { username: userName = "" } = props || {};

  const createNewProject = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/create', {
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
    console.log(showModal);
    handleVisibility(!showModal);
  }

  return (
    <Modal show={showModal} onHide={setVisibility} size='sm'>
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title className='modalTitle'>New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody" >
        <Form class="modalForm" action="">
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input type="email" value={title} className="form-control" id="teacherEmail" placeholder={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="userEmail">Created By:</label>
            <input type="email" value={userName} className="form-control" id="teacherEmail" placeholder={userName} required />
          </div>
        </Form>
        <Modal.Footer className='modalFooter'>
          <span><button type="button" class="btn btn-primary" onClick={createNewProject}>Create</button></span>
          <span><button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={setVisibility}>Cancel</button></span>
        </Modal.Footer>
      </Modal.Body>
    </Modal >
  );
};

export default CreateProject;