import React from 'react';
import { camelCase } from 'lodash';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ProjectList = ({ showModal, handleVisibility, props, reloadPage }) => {
    let count = 0;
    const [values, setValues] = ([props]);

    const setVisibility = () => {
        handleVisibility(!showModal);
    }

    const confirmDelete = async (projectId, listOfTodos) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this item?");
            const todoIds = listOfTodos?.taskIds || [];
            if (confirmed) {
                const response = await axios.delete(`https://todosnode-backend.netlify.app/.netlify/functions/app/deleteproject?projectId=${projectId}&&todoIds=${[...todoIds]}`);
                if (response) {
                    reloadPage();
                    alert("Project deleted");
                }
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    return (
        <Modal show={showModal} onHide={setVisibility} size='sm'>
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='modalTitle'>Project List</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody" >
                <div className="projectlist">
                    <table className="table" id="dataTable" >
                        <thead className='thead'>
                            <tr className='thead'>
                                <th scope="col">#</th>
                                <th scope="col">Project Title</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        {values?.map((item) => (
                            <tbody>
                                <script>{count += 1}</script>
                                <tr className='trow' index={item?._id} data-toggle="modal">
                                    <td>{count}{' '}</td>
                                    <td>{camelCase(item?.title)}{' '}</td>
                                    <td> {moment(item?.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                    <td colSpan={2}>
                                        <FontAwesomeIcon className="tableDeleteIcon" icon={faTrash} onClick={() => confirmDelete(item?.projectId, item?.listOfTodos)} title="remove task" />
                                    </td>
                                </tr>
                            </tbody>
                        ))
                        }
                    </table>
                    {(count === 0) &&
                        <div className="alert alert-warning" role="alert">
                            No Projects Found!
                        </div>}
                </div>
                <Modal.Footer className='modalFooter'>
                    <span><button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={setVisibility}>Close</button></span>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
};

export default ProjectList;
