import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import onlineBankingImage from '../images/onlineBankingImage.jpg'; // replace with your image path
import './HomePage.css';

const HomePage = () => {
  return (
    <Container className="homepage-container">
      <Row>
        <Col>
          <h1 className="homepage-title">BrightFund Bank: Illuminating Your Financial Future</h1>
        </Col>
      </Row>
      <Row className="homepage-content">
        <Col>
          <img src={onlineBankingImage} alt="Online Banking" className="homepage-image" />
        </Col>
        <Col>
          <div className="homepage-text">
            <h2>About Our Online Banking</h2>
            <p>
              A smooth, secure, and convenient method to manage your funds from anywhere, at any time. 
              Our cutting-edge digital platform enables you to access your accounts, transfer payments, pay bills, 
              and track your expenditure with a few simple clicks.
            </p>
            <p>
              Our online banking platform offers a wide range of features to help you manage your finances easily
              and securely. You can check your account balance, transfer funds, pay bills, and much more.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
