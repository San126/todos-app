import React, { useState, useEffect } from 'react';
import confirm from 'reactstrap-confirm';
import { useParams } from 'react-router-dom';
import { startCase, isEmpty, snakeCase } from 'lodash';
import { Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash, faFileExport } from '@fortawesome/free-solid-svg-icons';

import NavbarContents from './NavbarContents';
import CreateTask from './CreateTask';

const githubToken = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;

const ProjectDetails = ({ props }) => {
    const [formVisibility, setFormVisibility] = useState();
    const [projectName, setProjectName] = useState('');
    const [todos, setTodos] = useState({});
    const details = (localStorage.getItem('user'));
    const [taskDetails, setTaskDetails] = useState({});
    const [values, setValues] = useState([]);
    const [data, setData] = useState(JSON.parse(details));
    const [isEditing, setIsEditing] = useState(false);
    const [isTodoUpdated, setIsTodoUpdated] = useState(false);
    const [gistUrl, setGistUrl] = useState(localStorage.getItem('gistUrl') || '');
    const [error, setError] = useState(null);
    const { username: userName = "" } = data || {};
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
                size: "sm",
                confirmText: "Delete",
                confirmColor: "danger",
                cancelColor: "button",
                cancelColor: "dark"
            });

            if (result) {
                await axios.delete(`http://localhost:3001/auth/delete?taskId=${taskId}`).then(
                );
                setValues(values.filter((post) => post.taskId !== taskId));
                alert("Task deleted");
                handleReloadPage();
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
    });

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const isToDosUpdated = (currentStatus) => {
        setIsTodoUpdated(currentStatus);
    }

    const saveProjectUpdates = async () => {
        try {
            if (isEditing) {
                const response = await axios.post('http://localhost:3001/auth/create', {
                    createdBy: userName,
                    title: values[0]?.title,
                    updatedTitle: projectName,
                    action: "update"
                });
                window.location.reload();
                alert('Project updated successfully');
                console.log('Project updated successfully:', response.data);
            }
            else {
                alert("No Changes to Save");
            }
        } catch (error) {
            alert(error.response?.data?.message);
            console.error('Error updating project:', error);
        }
    }

    const handleFileExport = async () => {
        const completedTodos = todos[0]?.filter((element) => element.status === "completed");
        const totalTodos = todos[0].length || 0;
        const pendingTasks = todos[0]?.filter((element) => element.status !== "completed");
        try {

            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Project Summary Gist',
                    public: true,
                    files: {
                        'todos-app.md': {
                            content:
                                `# ${startCase(values[0]?.title)}
                        
**Summary:** ${completedTodos.length}/${totalTodos} completed.
                                                   
## Pending Todos
                           
${pendingTasks?.map(task => `- [ ] ${task?.description}`)?.join('\n') || "None"}

## Completed Todos
                           
${completedTodos?.map(task => `- [x] ${task?.description}`).join('\n')}`
                        }
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                setGistUrl(data.html_url);
                localStorage.setItem('gistUrl', data.html_url);
                setError(null);
            } else {
                throw new Error('Failed to create Gist');
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <Row>
                <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data} isEditing={isEditing} />

                <div className="details">
                    <Row>
                        <Col>
                            <p><h6>ProjectId: {projectId}</h6></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={5}>
                            <Row className='header'>
                                <h1><input className="input-border-none" type='projectTitle' value={startCase(projectName) || startCase(values[0]?.title)} onChange={(e) => setProjectName(e.target.value)} readOnly={!isEditing} /></h1>
                            </Row>
                            <Row lassName='gist'>
                                {gistUrl && <><h4>Gist Created:</h4> <p><a href={gistUrl} target="_blank" rel="noopener noreferrer">{gistUrl || localStorage.getItem('gistUrl')}</a></p></>}
                                {error && <p>Error: {error}</p>}
                            </Row>
                        </Col>
                        <Col className="icon" md={1}><Row><Col><FontAwesomeIcon icon={faEdit} onClick={handleEditToggle} styles={{ "padding-right": "10px" }} title="edit project title" /></Col><Col><FontAwesomeIcon styles={{ "padding-left": "10px" }} icon={faFileExport} onClick={handleFileExport} title="create project summary gist" /></Col></Row>
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                    <Row className='todolist'>
                        <Col md={3}>
                        </Col>
                        <Col md={5}>
                            <h3>Todos:</h3>
                        </Col>
                        <Col md={1}>
                            <Button className='addIcon' onClick={handleVisibility}>
                                <FontAwesomeIcon icon={faAdd} title="add new task" />
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
                                            <th scope="col">Create At</th>
                                            <th scope="col">Last Updated</th>
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
                                                <td> {moment(item?.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                                <td> {moment(item?.updatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                                                <td colSpan={2}>
                                                    <FontAwesomeIcon icon={faEdit} onClick={handleVisibility} style={{ paddingRight: "20px" }} title="edit task" />
                                                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(item?.taskId)} title="remove task" />
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
                </div>
                <Row>
                    <Col md={6}></Col>
                    <Col md={2}></Col>
                    <Col md={2}>
                        <span><button type="button" className="btn btn-primary" onClick={saveProjectUpdates}>Save Changes</button></span>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </Row>
            <div><CreateTask showModal={formVisibility} handleVisibility={handleVisibility} props={data} projectDetails={[...values]} reloadPage={handleReloadPage} taskDetails={taskDetails} isToDosUpdated={isToDosUpdated} /></div>
        </>
    );
}

export default ProjectDetails;