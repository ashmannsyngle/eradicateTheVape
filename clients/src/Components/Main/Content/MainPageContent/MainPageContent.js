import React, { useState, useEffect, Component} from 'react';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import './Styles/MainPageContent.css';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import BackGroundImage from './BackGroundImage';
import {ContentOne, ContentTwo, ContentThree, ContentFour, ContentFive, OurMission} from './FirstPageContent';

const MainPageContent = ({ user, setPage }) => {
    const [avatar, setAvatar] = useState(null)

    async function fetchAvatar() {
        const response = await fetch(api.base + api.handlers.myuserAvatar, {
            method: "GET",
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization")
            })
        });
        if (response.status >= 300) {
            // const error = await response.text();
            setAvatar(user.photoURL)
            return;
        }
        const imgBlob = await response.blob();
        setAvatar(URL.createObjectURL(imgBlob));
    }

    useEffect(() => {
        fetchAvatar();
        return;
    }, []);

    return <>
        <div className="display-user">
           <h1>Logged in as: <span className="red">{user.userName}</span></h1> 
        </div>
        {/* {avatar && <img className={"avatar"} src={avatar} alt={`${user.firstName}'s avatar`} />}
        <div><button onClick={(e) => { setPage(e, PageTypes.signedInUpdateName) }}>Update name</button></div>
        <div><button onClick={(e) => { setPage(e, PageTypes.signedInUpdateAvatar) }}>Update avatar</button></div> */}
        <Content />
    </>
}

export class Content extends Component {
    render() {
      let content = (
        <div>
          <BackGroundImage />
          <div className="content">
            <OurMission />
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

export default MainPageContent;