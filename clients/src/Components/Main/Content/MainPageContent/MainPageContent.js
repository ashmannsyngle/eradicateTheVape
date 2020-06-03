import React, { useState, useEffect, Component} from 'react';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import './Styles/MainPageContent.css';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import BackGroundImage from './BackGroundImage';
import {ContentOne, ContentTwo, ContentThree, ContentFour, ContentFive, OurMission} from './FirstPageContent';

const MainPageContent = ({ user, setPage }) => {

    return <>
        <Content setPage={setPage}/>
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
            <ContentFive setPage={this.props.setPage}/>
          </div>
        </div>
      )
      return content;
    }
}

export default MainPageContent;