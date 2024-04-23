import React, { useState, useEffect } from 'react';
import { upperFirst } from 'lodash';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Card, CardBody, CardFooter, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

import NavbarContents from './NavbarContents';
import CreateProject from './CreateProject';
import ProjectList from './ProjectList';

const Home = ({ }) => {
    const [formVisibility, setFormVisibility] = useState();
    const [listVisibility, setListVisibility] = useState();
    const details = (localStorage.getItem('user'));
    const [values, setValues] = useState();
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" } = data || {};
    const pathName = window.location.pathname;
    const pathParts = pathName.split('/');
    const currentPage = pathParts[pathParts.length -1];

    useEffect(() => {
        // Fetch data from the server
        fetch(`http://localhost:3001/auth/projectlist?userName=${username}`)
            .then(response => response.json())
            .then(data => setValues([...data]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);

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

    return (
        <>
            <Row>
                <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data} pathName={currentPage} />
                <div className="home">
                    <Row>
                        <p className="welcome"><h3>Welcome {upperFirst(username?.split('@')[0])}</h3></p>
                    </Row>
                    <Row className="cards">
                        <Col md={4}>
                            <Card className='add'>
                                <CardBody>
                                    <Button className="add" onClick={handleVisibility} title="add new project">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                                    </Button>
                                </CardBody>
                                <CardFooter className='add'>Create Project</CardFooter>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className='prolist'>
                                <CardBody>
                                    <Button className="prolist" onClick={handleListVisibility} title="project list">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='currentColor'><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" /></svg>
                                    </Button>
                                </CardBody>
                                <CardFooter className='prolist'>Projects</CardFooter>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className='project'>
                                <CardBody>
                                    <DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faFolderOpen} title='project details' />}>
                                        {values && values.map((item) => (
                                            <Dropdown.Item key={item._id} style={{ zIndex: 1000, display: "block", overflowY: 'auto' }} href="">
                                                <Link to={`/details/${item._id}`}>
                                                    {item && item.title}
                                                </Link>
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </CardBody>
                                <CardFooter className='project'>Project Details</CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Row>
            <div><CreateProject showModal={formVisibility} handleVisibility={handleVisibility} props={data} reloadPage={handleReloadPage} /></div>
            <div><ProjectList showModal={listVisibility} handleVisibility={handleListVisibility} props={values} /></div>
        </>
    );
}

export default Home;