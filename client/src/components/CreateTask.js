import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';

import '../styles.css';

const CreateTask = ({ showModal, handleVisibility, reloadPage, props, projectDetails }) => {
    const [statusValue, setStatusValue] = useState('');
    const [task, setTask] = useState('');
    const [values, setValues] = useState([]);
    const details = projectDetails[0];
    console.log(details)
    const { username: userName = "" } = props || {};
    const { title = "", _id: projectId = "" } = details || {};
    console.log(details)

    const createNewTask = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/createtask', {
                projectId,
                description: task,
                statusValue,
                createdBy: userName
            });
            handleVisibility(false);
            setValues([...values, response.data]);
            reloadPage();
            alert('Task created successfully');
            console.log('Task created successfully:', response.data);
        } catch (error) {
            alert(error.response?.data?.message);
            console.error('Error creating project:', error);
        }
    };

    const setVisibility = () => {
        console.log(showModal);
        handleVisibility(!showModal);
    }

    const handleStatusChange = (e) => {
        setStatusValue(e.target.value);
    }

    return (
        <Modal show={showModal} onHide={setVisibility} size='sm'>
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='modalTitle'>New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody" >
                <Form className="modalForm" action="">
                    <div className="form-group">
                        <label htmlFor="title">Project Title</label>
                        <input type="title" value={title} className="form-control" id="title" placeholder={title} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Description</label>
                        <input type="title" value={task} className="form-control" id="description" placeholder={task || 'Enter task description'} onChange={(e) => setTask(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="select">Status</label>
                        <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                            <option>Select the status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userEmail">Created By:</label>
                        <input type="email" value={userName} className="form-control" id="userEmail" placeholder={userName} readOnly />
                    </div>
                </Form>
                <Modal.Footer className='modalFooter'>
                    <span><button type="button" className="btn btn-primary" onClick={createNewTask}>Create</button></span>
                    <span><button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={setVisibility}>Cancel</button></span>
                </Modal.Footer>
            </Modal.Body>
        </Modal >
    );
};

export default CreateTask;
