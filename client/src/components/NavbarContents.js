import { useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from "lodash";

import axios from 'axios';

const NavbarContents = ({ visibility, reloadPage, data }) => {
  const [formVisibility, setFormVisibility] = useState(visibility || false);
  const navigate = useNavigate();

  const logOut = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:3001/auth/logout', {})
        .then(() => {
          navigate('/');
          alert("Logged out...");
        });
    }
    catch (err) {
      console.error('Error while login', err);
    }
  }

  const handleVisibility = () => {
    setFormVisibility(!formVisibility);
  };

  return (
    <>
      <nav className="navbar">
        <span class="nav-design"><h4>Todos App</h4></span>
        <span>
          {!isEmpty(data?.username) && <span className='list-icon'>
            <Dropdown className='dropdownmenu' toggle={function noRefCheck() { }}>
              <DropdownToggle
                className='dropdownToggle'
                data-toggle="dropdown"
                tag="span"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
              </DropdownToggle>
              <DropdownMenu className='menu'>
                <div className="menuItem1" onClick={handleVisibility} >
                  Projects
                </div>
              </DropdownMenu>
            </Dropdown>
          </span>}
          <span className='dropdown'>
            <Dropdown className='dropdownmenu' toggle={function noRefCheck() { }}>
              <DropdownToggle
                className='dropdownToggle'
                data-toggle="dropdown"
                tag="span"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                </svg>
              </DropdownToggle>
              <DropdownMenu className='menu'>
                <div className="menuItem2" onClick={logOut}>
                  Logout
                </div>
              </DropdownMenu>
            </Dropdown>
          </span>
        </span>
      </nav>
    </>
  );
}

export default NavbarContents;