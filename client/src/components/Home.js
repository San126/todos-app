import React, { useEffect, useState } from 'react';
import { upperFirst } from 'lodash';
import moment from 'moment';

import NavbarContents from './NavbarContents';
import {  Row, Col, Button, Card, CardBody, CardFooter } from 'react-bootstrap';

const Home = () => {
    const [classes, setClasses] = useState([]);
    const [formVisibility, setFormVisibility] = useState();
    const details = (localStorage.getItem('user'));
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" } = data || {};
    let count = 0;

    useEffect(() => {
        // Fetch data from the server
        fetch(`http://localhost:3001/auth/schedulelist?userName=${username}`)
            .then(response => response.json())
            .then(data => setClasses([...classes, ...data]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);

    const handleReloadPage = () => {
        const details = (localStorage.getItem('user'));
        setData(JSON.parse(details));
        window.location.reload();
    };

    return (
        <Row>
            <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data} />
            <div className="home">
            <Row>
                <p class="welcome"><h3>Welcome {upperFirst(username?.split('@')[0])}</h3></p>
                </Row>
                <Row className="cards">
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <Button className="add">+</Button>
                            </CardBody>
                            <CardFooter>Create Project</CardFooter>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <Button className="prolist">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                                    </svg>
                                </Button>
                            </CardBody>
                            <CardFooter>Projects</CardFooter>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                            <Button className="project" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/></svg>
                            </Button>
                                </CardBody>
                            <CardFooter>Project Details</CardFooter>
                        </Card>
                    </Col>
                    </Row>
            </div>
            </Row>
    );
}

export default Home;