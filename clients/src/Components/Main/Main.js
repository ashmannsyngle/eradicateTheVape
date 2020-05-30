import React, { Component } from 'react';
import PageTypes from '../../Constants/PageTypes/PageTypes';
import MainPageContent from './Content/MainPageContent/MainPageContent';
import SignOutButton from './Components/SignOutButton/SignOutButton';
import UpdateName from './Components/UpdateName/UpdateName';
import NavBar from './Components/NavBar/NavBar';
import BackGroundImage from './BackGroundImage';
import {ContentOne, ContentTwo, ContentThree, ContentFour, ContentFive} from './FirstPageContent';
import UpdateAvatar from './Components/UpdateAvatar/UpdateAvatar';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect } from 'react-router-dom';

const Main = ({ page, setPage, setAuthToken, setUser, user }) => {
    let content = <></>
    let contentPage = true;
    switch (page) {
        case PageTypes.signedInMain:
            content = <MainPageContent user={user} setPage={setPage} />;
            break;
        case PageTypes.signedInUpdateName:
            content = <UpdateName user={user} setUser={setUser} />;
            break;
        case PageTypes.signedInUpdateAvatar:
            content = <UpdateAvatar user={user} setUser={setUser} />;
            break;
        default:
            content = <>Error, invalid path reached</>;
            contentPage = false;
            break;
    }
    return <>
        <NavBar />
        <Switch>
              <Route exact path = "/" component={Content} />
              {/* <Route exact path="/others" render={this.getList} />
              <Route exact path="/confession" component={Confession} />
              <Route exact path="/postconfession" render={this.getUser} /> */}
          </Switch>
        {content}
        {contentPage && <button onClick={(e) => setPage(e, PageTypes.signedInMain)}>Back to main</button>}
        <SignOutButton setUser={setUser} setAuthToken={setAuthToken} />
    </>
}

export class Content extends Component {
    render() {
      let content = (
        <div>
          <BackGroundImage />
          <div className="content">
            <ContentOne />
            <ContentTwo />
            <ContentThree />
            <ContentFour />
            <ContentFive />
          </div>
        </div>
      )
      return content;
    }
  }

export default Main;