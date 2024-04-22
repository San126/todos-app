import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { startCase } from 'lodash';
import { Row, Col, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import NavbarContents from './NavbarContents';

const ProjectDetails = ({ props }) => {
    const [formVisibility, setFormVisibility] = useState();
    const [listVisibility, setListVisibility] = useState();
    const [projectName, setProjectName] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const details = (localStorage.getItem('user'));
    const [values, setValues] = useState([]);
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" } = data || {};
    let count = 0;
    const { projectId } = useParams();

    useEffect(() => {
        // Fetch data from the server
        fetch(`http://localhost:3001/auth/details?projectId=${projectId}`)
            .then(response => response.json())
            .then(data => setValues([...values, data]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);
    console.log(...values)
    const handleReloadPage = () => {
        const details = (localStorage.getItem('user'));
        setData(JSON.parse(details));
        window.location.reload();
    };

    const handleVisibility = () => {
        setFormVisibility(!formVisibility);
    };

    const handleListVisibility = () => {
        setListVisibility(!listVisibility);
    }

    const handleTodoAdd = () => {
        if (newTodo.trim() !== '') {
            setTodos([...todos, { id: todos.length + 1, description: newTodo }]);
            setNewTodo(''); // Clear input field after adding todo
        }
    };


    return (
        <>
            <Row>
                <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data} />

                <div className="details">
                    {/* <Col md={4}></Col> */}
                    <Row>
                        <Col>
                            <p><h6>ProjectId: {projectId}</h6></p>
                        </Col>
                    </Row>
                    <Row >
                        <Col md={3}></Col>
                        <Col md={5}>
                            <Row>
                                <h1><input className="input-border-none" type='projectTitle' value={projectName || values[0]?.title} onChange={(e) => setProjectName(e.target.value)} /></h1>
                            </Row>
                            {/* </Col> */}
                        </Col>
                        <Col className="icon" md={1}><FontAwesomeIcon icon={faEdit} /></Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row className='todolist'>
                        <Col md={3}></Col>
                        <Col md={5}>
                            <h3>Todos:</h3>
                        </Col>
                        <Col md={1}>
                            <Button className='addIcon' onClick={handleTodoAdd}>
                                <FontAwesomeIcon icon={faAdd} />
                            </Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            {[...values]?.listOfTodos ?
                                <table className="table table-striped table-sm" id="dataTable" >
                                    <thead className='thead'>
                                        <tr className='thead'>
                                            <th scope="col">#</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    {values[0]?.todoList?.map((item) => (
                                        <tbody>
                                            <script>{count += 1}</script>
                                            <tr className='trow' index={item?._id} data-toggle="modal">
                                                <td>{count}{' '}</td>
                                                <td>{startCase(item?.description)}{' '}</td>
                                                <td>{startCase(item?.status)}{' '}</td>
                                                <td colSpan={3}>
                                                    <FontAwesomeIcon icon={faEye} /><FontAwesomeIcon icon={faEdit} /><FontAwesomeIcon icon={faTrash} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))
                                    }
                                </table>
                                :
                                todos ?
                                    <></>
                                    :
                                    <div className="alert alert-warning" role="alert">
                                        No tasks found!
                                    </div>
                            }
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    {/* <Col md={4}></Col> */}
                </div>
            </Row>
        </>
    );
}

export default ProjectDetails;