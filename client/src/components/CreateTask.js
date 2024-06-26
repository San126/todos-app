import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';

const CreateTask = ({ showModal, handleVisibility, reloadPage, props, projectDetails, taskDetails, isToDosUpdated }) => {
    const { status = '', description = '', taskId: todoId = '' } = taskDetails || {};
    const [statusValue, setStatusValue] = useState('');
    const [task, setTask] = useState('');
    const [values, setValues] = useState([]);
    const details = projectDetails[0];
    const { username: userName = "" } = props || {};
    const { title = "", _id: projectId = "" } = details || {};

    const createAndUpdateTask = async () => {
        try {
            if (task && statusValue) {
                const response = await axios.post('https://todosnode-backend.netlify.app/.netlify/functions/app/createtask', {
                    projectId,
                    taskId: todoId,
                    description: task || description,
                    statusValue: statusValue || status,
                    createdBy: userName
                });
                isToDosUpdated(true);
                handleVisibility(false);
                setValues([...values, response?.data]);
                localStorage.setItem('gistUrl', '');
                reloadPage();
                alert(todoId ? 'Task updated successfully' : 'Task created successfully');
                console.log('Task created successfully:', response?.data);
            }
            else {
                alert("Please provide the task name and status");
            }
        } catch (error) {
            alert(error?.response?.data?.message);
            console.error('Error creating project:', error);
        }
    };

    const setVisibility = () => {
        handleVisibility(!showModal);
    }

    return (
        <Modal className='createmodal' show={showModal} onHide={setVisibility} size="md" >
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
                        <input type="email" value={task || taskDetails?.description} className="form-control" id="description" placeholder={'Enter task description'} onChange={(e) => setTask(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="select">Status</label>
                        <select value={statusValue || taskDetails?.status} onChange={(e) => setStatusValue(e.target.value)}>
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
                    <span><button type="button" className="btn btn-primary" onClick={createAndUpdateTask} >{todoId ? "Update" : "Create"}</button></span>
                    <span><button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={setVisibility}>Cancel</button></span>
                </Modal.Footer>
            </Modal.Body>
        </Modal >
    );
};

export default CreateTask;
