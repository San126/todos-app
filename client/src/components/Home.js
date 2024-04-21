import React, { useEffect, useState } from 'react';
import { upperFirst } from 'lodash';
import moment from 'moment';
import { Row, Col, Button, Card, CardBody, CardFooter } from 'react-bootstrap';

import NavbarContents from './NavbarContents';
import CreateProject from './CreateProject';
import ProjectList from './ProjectList';

const Home = ({ }) => {
    const [classes, setClasses] = useState([]);
    const [formVisibility, setFormVisibility] = useState();
    const [listVisibility, setListVisibility] = useState();
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

    const handleVisibility = () => {
        setFormVisibility(!formVisibility);
    };

    const handleListVisibility = () => {
        setListVisibility(!listVisibility);
    }

    return (
        <>
            <Row>
                <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data} />
                <div className="home">
                    <Row>
                        <p class="welcome"><h3>Welcome {upperFirst(username?.split('@')[0])}</h3></p>
                    </Row>
                    <Row className="cards">
                        <Col md={4}>
                            <Card className='add'>
                                <CardBody>
                                    <Button className="add" onClick={handleVisibility}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                                    </Button>
                                </CardBody>
                                <CardFooter className='add'>Create Project</CardFooter>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className='prolist'>
                                <CardBody>
                                    <Button className="prolist" onClick={handleListVisibility}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='currentColor'><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" /></svg>
                                    </Button>
                                </CardBody>
                                <CardFooter className='prolist'>Projects</CardFooter>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className='project'>
                                <CardBody>
                                    <Button className="project" >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                    </Button>
                                </CardBody>
                                <CardFooter className='project'>Project Details</CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Row>
            <div><CreateProject showModal={formVisibility} handleVisibility={handleVisibility} props={data} reloadPage={handleReloadPage} /></div>
            <div><ProjectList showModal={listVisibility} handleVisibility={handleListVisibility} /></div>
        </>
    );
}

export default Home;