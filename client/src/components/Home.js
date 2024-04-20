import React, { useEffect, useState } from 'react';
import { upperFirst } from 'lodash';
import moment from 'moment';

import NavbarContents from './NavbarContents';

const Home = () =>{
    const [classes, setClasses] = useState([]);
    const [formVisibility, setFormVisibility] = useState();
    const details = (localStorage.getItem('user'));
    const [data, setData] = useState(JSON.parse(details));
    const { username = "" }  = data || {};
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
        <>
            <NavbarContents visibility={formVisibility} reloadPage={handleReloadPage} data={data}/>
            <div className="home">
                <p class="welcome"><h3>Welcome {upperFirst(username?.split('@')[0])}</h3></p>
            </div>
        </>
    );
}

export default Home;