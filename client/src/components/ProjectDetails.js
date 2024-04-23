import React, { useState, useEffect } from 'react';
import confirm from 'reactstrap-confirm';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { startCase, isEmpty, snakeCase } from 'lodash';
import { Row, Col, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import NavbarContents from './NavbarContents';
import CreateTask from './CreateTask';

const ProjectDetails = ({ props }) => {
    const [formVisibility, setFormVisibility] = useState();
    const [listVisibility, setListVisibility] = useState();
    const [projectName, setProjectName] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const [todos, setTodos] = useState({});
    const details = (localStorage.getItem('user'));
    const [taskDetails, setTaskDetails] = useState({});
    const [values, setValues] = useState([]);
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" } = data || {};
    let count = 0;
    const table = document.getElementById('todoTable');
    const { projectId } = useParams();

    useEffect(() => {
        // Fetch data from the server
        fetch(`http://localhost:3001/auth/details?projectId=${projectId}`)
            .then(response => response.json())
            .then(data => (setValues([data._doc]),
                setTodos([data.todoListDetails])))
            .catch(error => console.error('Error fetching data:', error));
    }, [projectId]);
    console.log(values, todos)

    const handleReloadPage = () => {
        const details = (localStorage.getItem('user'));
        setData(JSON.parse(details));
        window.location.reload();
    };

    const handleVisibility = () => {
        setFormVisibility(!formVisibility);
    };

    const deleteTask = async (taskId) => {
        try {
            let result = await confirm({
                title: (
                    <>
                        <strong>Delete</strong>!
                    </>
                ),
                message: "Do you want to delete the task?",
                confirmText: "Confirm",
                confirmColor: "primary",
                cancelColor: "link text-danger"
            });
            if (result) {
                await axios.delete(`http://localhost:3001/auth/delete?taskId=${taskId}`).then(
                );
                setValues(values.filter((post) => post.taskId !== taskId));
                alert("Task deleted");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    table?.addEventListener('click', function (event) {
        const cell = event.target;
        const row = cell.closest('tr');

        if (row) {
            const cells = row.cells;
            if (cells) {
                const rowData = Array.from(cells).map(cell => cell.textContent);

                const task = todos[0]?.forEach((element) => {
                    console.log(rowData[1], rowData[2])
                    if (snakeCase(element.description) === snakeCase(rowData[1])) {
                        setTaskDetails({ ...element });
                    }
                });
                console.log('Clicked row contents:', rowData, taskDetails);
            } else {
                console.log('No cells found in the row.');
            }
        } else {
            console.log('No row found.');
        }
        // }
    });

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
                            <Button className='addIcon' onClick={handleVisibility}>
                                <FontAwesomeIcon icon={faAdd} />
                            </Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8}>
                            {!isEmpty(todos[0]) ?
                                <table className="table table-striped table-sm" id="todoTable" >
                                    <thead className='thead'>
                                        <tr className='thead'>
                                            <th scope="col">#</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    {todos[0]?.map((item) => (
                                        <tbody>
                                            <script>{count += 1}</script>
                                            <tr className='trow' index={item?._id} data-toggle="modal">
                                                <td>{count}{' '}</td>
                                                <td>{startCase(item?.description)}{' '}</td>
                                                <td>{startCase(item?.status)}{' '}</td>
                                                <td colSpan={2}>
                                                    <FontAwesomeIcon icon={faEdit} onClick={handleVisibility} />
                                                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(item?.taskId)} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))
                                    }
                                </table>
                                :
                                !isEmpty(todos) ?
                                    <></>
                                    :
                                    <div className="alert alert-warning" role="alert">
                                        No tasks found!
                                    </div>
                            }
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                    {/* <Col md={4}></Col> */}
                </div>
                <Row>
                    <Col md={6}></Col>
                    <Col md={3}></Col>
                    <Col md={2}>
                        <span><button type="button" className="btn btn-primary">Save Changes</button></span>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Row>
            <div><CreateTask showModal={formVisibility} handleVisibility={handleVisibility} props={data} projectDetails={[...values]} reloadPage={handleReloadPage} taskDetails={taskDetails} /></div>
        </>
    );
}

export default ProjectDetails;