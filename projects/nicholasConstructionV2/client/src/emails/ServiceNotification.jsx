import logo from "../components/assets/logo.png"
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Text,
  } from '@react-email/components';
  import * as React from 'react';

  export const ServiceNotification = (props) => (
    <Html>
      <Head />
      <Body style={main}>
        <Container >
          <Heading >Booking Confirmation</Heading>
          <Text>
            {props.firstName} {props.lastName} has scheduled a new booking!
          </Text>
          <Text>
            Here is the information about their booking. Give them a call to work out anymore details!
          </Text>
          <Text>
            Full name: {props.firstName} {props.lastName}
          </Text>
          <Text>
            Phone number: {props.phone}
          </Text>
          <Text>
            Date Scheduled : {props.dateOfService}
          </Text>
          <Text>
            Address: {props.address}
          </Text>
          <Text>
            Service: {props.service}
          </Text>
          <Text>
            Description: {props.desc}
          </Text>
          <Img
            src={logo}
            width="50"
            height="35"
            alt="Company Logo"
          />
        </Container>
      </Body>
    </Html>
  );
  
  export default ServiceNotification;
  
  const main = {
    backgroundColor: '#ffffff',
  };
