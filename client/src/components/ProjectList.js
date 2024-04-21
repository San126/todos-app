import React, { useEffect, useState } from 'react';
import { camelCase } from 'lodash';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

const ProjectList = ({ showModal, handleVisibility }) => {
    const [values, setValues] = useState([]);
    const details = (localStorage.getItem('user'));
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" } = data || {};
    let count = 0;

    useEffect(() => {
        // Fetch data from the server
        fetch(`http://localhost:3001/auth/projectlist?userName=${username}`)
            .then(response => response.json())
            .then(data => setValues([...values, ...data]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);

    const setVisibility = () => {
        console.log(showModal);
        handleVisibility(!showModal);
    }

    return (
        <Modal show={showModal} onHide={setVisibility} size='sm'>
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='modalTitle'>Project List</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody" >
                <div className="projectlist">
                    <table className="table table-striped table-sm" id="dataTable" >
                        <thead className='thead'>
                            <tr className='thead'>
                                <th scope="col">#</th>
                                <th scope="col">Project Title</th>
                                <th scope="col">Created At</th>
                            </tr>
                        </thead>
                        {values.map((item) => (
                            // (moment('YYYY-MM-DDTHH:mm:ss').isAfter(moment(classItem.scheduledTime, 'YYYY-MM-DDTHH:mm:ss'))) !== true ?
                            <tbody>
                                <script>{count += 1}</script>
                                <tr className='trow' index={item._id} data-toggle="modal">
                                    <td>{count}{' '}</td>
                                    <td>{camelCase(item.title)}{' '}</td>
                                    <td> {moment(item.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
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
