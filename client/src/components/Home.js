import React from "react";
import {
  Button,
  Header,
  Image,
  Icon
} from "semantic-ui-react";
import Page from "./Page";
import previewImage from "../preview.png";

const Home = () => {
  return (
    <Page>
      <div id="home">
        <div>
          <Header id="home-header" as="h1" textAlign="center">
            <Icon name="comments" />
            CONVOLINK
          </Header>
          <div id="sub-header" as="h4" textAlign="center">
            Who needs video? Join the the conversation today.
          </div>
        </div>
        <div>
          <Image src={previewImage} />
          <div id="home-actions">
            <a href="/login">
              <Button
                className="home-btns submit-btn"
                attached="left"
                size="Big"
              >
                LOGIN
              </Button>
            </a>
            <a href="/signup">
              <Button
                className="home-btns signup-btn"
                attached="right"
                size="Big"
              >
                SIGN UP
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Home;
