import React from "react";
import {
  Button,
  TextField,
  Stack,
  Typography,
  MenuItem,
  Box,
  Card,
  Alert,
  Container,
  AlertTitle,
  List,
  ListItem,
} from "@mui/material";

import {
  getCitizen,
  getFlight,
  addPersonToFlight,
} from "../services/blockchain";

interface State {
  flight_id: number;
  citizen_id: number;
  flight_error: boolean | null;
  citizen_error: boolean | null;
  illegal_travel: boolean | null;
}
interface CitizenDataState {
  id: number;
  name: string;
  passport_num: string;
  nationality: string;
  last_known_location: string;
}
interface FlightDataState {
  id: number;
  code: string;
  operator: string;
  departure: string;
  arrival: string;
}
interface BlockChainTransactionState {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  gasUsed: number;
}

const AddPersonToFlight: React.FC = () => {
  const [values, setValues] = React.useState<State>({
    flight_id: 0,
    citizen_id: 0,
    flight_error: null,
    citizen_error: null,
    illegal_travel: null,
  });
  const [citizenValues, setCitizenValues] = React.useState<CitizenDataState>({
    id: 0,
    name: "",
    passport_num: "",
    nationality: "",
    last_known_location: "",
  });
  const [flightValues, setFlightValues] = React.useState<FlightDataState>({
    id: 0,
    code: "",
    operator: "",
    departure: "",
    arrival: "",
  });
  const [transactionValues, setTransactionValues] =
    React.useState<BlockChainTransactionState>({
      transactionHash: "",
      transactionIndex: 0,
      blockHash: "",
      blockNumber: 0,
      contractAddress: "",
      cumulativeGasUsed: 0,
      gasUsed: 0,
    });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    category: string
  ) => {
    event.preventDefault();
    if (category === "flight") {
      getFlight(values.flight_id)
        .then((e: any) => {
          setFlightValues({
            ...flightValues,
            id: e.id,
            code: e.code,
            operator: e.operator,
            arrival: e.arrival_airport_code,
            departure: e.departure_airport_code,
          });
          setValues({ ...values, flight_error: false });
        })
        .catch((e: Error) => {
          setValues({ ...values, flight_error: true });
          console.log("An error has ocured: ", e);
        });
    } else if (category === "citizen") {
      getCitizen(values.citizen_id)
        .then((e: any) => {
          setCitizenValues({
            id: e.id,
            name: e.name,
            passport_num: e.passport_number,
            nationality: e.nationality,
            last_known_location: e.last_known_location,
          });
          setValues({ ...values, citizen_error: false });
        })
        .catch((e: Error) => {
          setValues({ ...values, citizen_error: true });
          console.log("An error has ocured: ", e);
        });
    }
  };

  const checkIllegalTravel = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    addPersonToFlight(values.citizen_id, values.flight_id)
      .then((e: any) => {
        console.log(e);
        setTransactionValues({
          transactionHash: e.transactionHash,
          transactionIndex: e.transactionIndex,
          blockHash: e.blockHash,
          blockNumber: e.blockNumber,
          contractAddress: e.to,
          cumulativeGasUsed: e.cumulativeGasUsed,
          gasUsed: e.gasUsed,
        });
        setValues({ ...values, illegal_travel: false });
      })
      .catch((e: any) => {
        setValues({ ...values, illegal_travel: true });
        console.log("An error has ocured: ", e);
      });
  };

  return (
    <Container sx={{ padding: 5 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 6, md: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            sx={{
              maxWidth: 425,
              marginX: "auto",
              textAlign: "center",
              paddingBottom: 2,
            }}
          >
            Search for Flight
          </Typography>
          <form
            action="/"
            method="POST"
            onSubmit={(e) => {
              handleFormSubmit(e, "flight");
            }}
          >
            <Card
              variant="outlined"
              sx={{ maxWidth: 425, marginX: "auto", padding: 3, marginY: 2 }}
            >
              <Stack spacing={2}>
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="ID (Numbers only)"
                  required={true}
                  onChange={handleChange("flight_id")}
                />
                <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
                  Submit
                </Button>
              </Stack>
            </Card>
          </form>
          <Card
            variant="outlined"
            sx={{ maxWidth: 425, marginX: "auto", padding: 3, marginY: 2 }}
          >
            {values.flight_error !== null ? (
              values.flight_error === true ? (
                <Alert severity="error">Error — Flight does not exists!</Alert>
              ) : (
                <Alert severity="success">
                  Success — Flight fetched successfully!
                </Alert>
              )
            ) : null}
            {values.flight_error !== null && values.flight_error !== true ? (
              <div>
                <List>
                  <ListItem>ID: {flightValues.id}</ListItem>
                  <ListItem>Code: {flightValues.code}</ListItem>
                  <ListItem>Operator: {flightValues.operator}</ListItem>
                  <ListItem>Arrival: {flightValues.arrival}</ListItem>
                  <ListItem>Departure: {flightValues.departure}</ListItem>
                </List>
              </div>
            ) : null}
          </Card>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            sx={{
              maxWidth: 425,
              marginX: "auto",
              textAlign: "center",
              paddingBottom: 2,
            }}
          >
            Search for Person
          </Typography>
          <form
            action="/"
            method="POST"
            onSubmit={(e) => {
              handleFormSubmit(e, "citizen");
            }}
          >
            <Card
              variant="outlined"
              sx={{ maxWidth: 425, marginX: "auto", padding: 3, marginY: 2 }}
            >
              <Stack spacing={2}>
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="ID (Numbers only)"
                  required={true}
                  onChange={handleChange("citizen_id")}
                />
                <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
                  Submit
                </Button>
              </Stack>
            </Card>
          </form>
          <Card
            variant="outlined"
            sx={{ maxWidth: 425, marginX: "auto", padding: 3, marginY: 2 }}
          >
            {values.citizen_error !== null ? (
              values.citizen_error === true ? (
                <Alert severity="error">Error — User does not exists!</Alert>
              ) : (
                <Alert severity="success">
                  Success — User fetched successfully!
                </Alert>
              )
            ) : null}
            {values.citizen_error !== null && values.citizen_error !== true ? (
              <div>
                <List>
                  <ListItem>ID: {citizenValues.id}</ListItem>
                  <ListItem>Name: {citizenValues.name}</ListItem>
                  <ListItem>
                    Passport Number: {citizenValues.passport_num}
                  </ListItem>
                  <ListItem>Nationality: {citizenValues.nationality}</ListItem>
                  <ListItem>
                    Last Known Location: {citizenValues.last_known_location}
                  </ListItem>
                </List>
              </div>
            ) : null}
          </Card>
        </Box>
      </Stack>
      <Stack>
        <Button
          disabled={
            values.flight_error === false && values.citizen_error === false
              ? false
              : true
          }
          variant="outlined"
          sx={{ margin: 10, padding: 5 }}
          onClick={(e) => checkIllegalTravel(e)}
        >
          Check if allowed to board
        </Button>
        {values.illegal_travel !== null ? (
          values.illegal_travel === true ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              Person has attempted to travel illegally!
            </Alert>
          ) : (
            <div>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Person can board the plane successfully!
              </Alert>
              <List>
                <ListItem>
                  transactionHash: {transactionValues.transactionHash}
                </ListItem>
                <ListItem>
                  transactionIndex: {transactionValues.transactionIndex}
                </ListItem>
                <ListItem>blockHash: {transactionValues.blockHash}</ListItem>
                <ListItem>
                  blockNumber: {transactionValues.blockNumber}
                </ListItem>
                <ListItem>
                  contractAddress: {transactionValues.contractAddress}
                </ListItem>
                <ListItem>
                  cumulativeGasUsed: {transactionValues.cumulativeGasUsed}
                </ListItem>
                <ListItem>gasUsed: {transactionValues.gasUsed}</ListItem>
              </List>
            </div>
          )
        ) : null}
      </Stack>
    </Container>
  );
};

export default AddPersonToFlight;
