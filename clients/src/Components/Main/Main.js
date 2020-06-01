import React, { Component } from 'react';
import PageTypes from '../../Constants/PageTypes/PageTypes';
import MainPageContent from './Content/MainPageContent/MainPageContent';
import SignOutButton from './Components/SignOutButton/SignOutButton';
import UpdateName from './Components/UpdateName/UpdateName';
import UpdateAvatar from './Components/UpdateAvatar/UpdateAvatar';
import Marketplace from './Components/Marketplace/Marketplace';
import Progress from './Components/Progress/Progress';
import Profile from './Components/Profile/Profile';
import Threads from './Components/Threads/Threads';
import CreateThread from './Components/CreateThread/CreateThread';
import SpecificThreads from './Components/SpecificThreads/SpecificThreads';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect } from 'react-router-dom';

const Main = ({ page, setPage, setAuthToken, setUser, user, thread, setThread }) => {
    let content = <></>
    let contentPage = true;
    switch (page) {
        case PageTypes.signedInMain:
            content = <MainPageContent user={user} setPage={setPage} />;
            break;
        case PageTypes.signedInUpdateName:
            content = <UpdateName user={user} setUser={setUser} setPage={setPage} />;
            break;
        case PageTypes.signedInUpdateAvatar:
            content = <UpdateAvatar user={user} setUser={setUser} />;
            break;
        case PageTypes.marketplace:
            content = <Marketplace user={user} setUser={setUser}/>;
            break;
        case PageTypes.progress:
            content = <Progress user={user} setUser={setUser}/>;
            break;
        case PageTypes.threads:
            content = <Threads user={user} setPage={setPage} setThread={setThread}/>;
            break;
        case PageTypes.profile:
            content = <Profile user={user} setUser={setUser} setPage={setPage}/>;
            break;
        case PageTypes.createThreads:
            content = <CreateThread user={user} setPage={setPage}/>;
            break;
        case PageTypes.specificThreads:
            content = <SpecificThreads user={user} setPage={setPage} thread={thread}/>;
            break;
        default:
            content = <>Error, invalid path reached</>;
            contentPage = false;
            break;
    }
    return <>
        <div>
        <nav>
            <h1 id="logo"><a onClick={(e) => setPage(e, PageTypes.signedInMain)}>EradicateThe<span className="red">Vape</span></a></h1>
            <ul>
              <li id="home">
                <div><button onClick={(e) => { setPage(e, PageTypes.signedInMain) }}>HOME</button></div>
              </li>
              <li id="progress">
                <div><button onClick={(e) => { setPage(e, PageTypes.progress) }}>PROGRESS</button></div>
              </li>
              <li id="marketplace">
                <div><button onClick={(e) => { setPage(e, PageTypes.marketplace) }}>MARKETPLACE</button></div>
              </li>
              <li id="threads">
                <div><button onClick={(e) => { setPage(e, PageTypes.threads) }}>THREADS</button></div>
              </li>
              <li id="profile">
                <div><button onClick={(e) => { setPage(e, PageTypes.profile) }}>PROFILE</button></div>
              </li>
            </ul>
          </nav>
        </div>
        {content}
        <SignOutButton setUser={setUser} setAuthToken={setAuthToken} />
        <footer>
            <div className="contact_group">
            <img src="images/line.png" alt="line for decoration" />
            <h3>CONTACT US</h3>
            <img src="images/line.png" alt="line for decoration" />
            </div>
            <address>
            <a href="mailto:shray8@uw.edu" aria-label="Mail us">MAIL US</a>
            <a href="tel:555-123-4567" aria-label="Call Us">CALL US</a>
            </address>
            <p>&copy; 2020 Designed &amp; Coded by <span className="red">Ashmann Syngle</span>, <span className="red">Shray Arora</span> and <span className="red">Sarah West</span></p>
        </footer>
    </>
}

export default Main;