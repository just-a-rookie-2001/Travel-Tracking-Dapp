import React from "react";
import {
  Button,
  TextField,
  Stack,
  Typography,
  MenuItem,
  Card,
  Alert,
  Container,
} from "@mui/material";

import countryList from "../data/countries.json";
import { createFlightOnBlockchain } from "../services/blockchain";

interface State {
  id: string;
  code: string;
  flight_name: string;
  operator: string;
  departure: string;
  arrival: string;
  error: boolean | null;
}

const CreatePerson: React.FC = () => {
  const [values, setValues] = React.useState<State>({
    id: "",
    code: "",
    flight_name: "",
    operator: "",
    departure: "",
    arrival: "",
    error: null,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createFlightOnBlockchain(
      values.id,
      values.code,
      values.flight_name,
      values.operator,
      values.departure,
      values.arrival
    )
      .then((e: any) => setValues({ ...values, error: false }))
      .catch((e: Error) => {
        setValues({ ...values, error: true });
        console.log("An error has ocured: ", e);
      });
  };

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{
          maxWidth: 425,
          marginX: "auto",
          textAlign: "center",
          paddingBottom: 2,
        }}
      >
        Create a New Flight
      </Typography>
      <form
        action="/"
        method="POST"
        onSubmit={(e) => {
          handleFormSubmit(e);
        }}
      >
        <Card
          variant="outlined"
          sx={{ maxWidth: 425, marginX: "auto", padding: 3 }}
        >
          <Stack spacing={2}>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              label="ID (Numbers only)"
              required={true}
              value={values.id}
              onChange={handleChange("id")}
            />
            <TextField
              label="Flight Number"
              required={true}
              value={values.code}
              onChange={handleChange("code")}
            />
            <TextField
              label="Flight Name"
              required={true}
              value={values.flight_name}
              onChange={handleChange("flight_name")}
            />
            <TextField
              required={true}
              label="Operator"
              value={values.operator}
              onChange={handleChange("operator")}
            />
            <TextField
              required={true}
              select
              label="Select Departure Country"
              value={values.departure}
              onChange={handleChange("departure")}
            >
              {countryList.map((option) => (
                <MenuItem key={option.code} value={option.name}>
                  {option.name} ({option.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required={true}
              select
              label="Select Arrival Country"
              value={values.arrival}
              onChange={handleChange("arrival")}
            >
              {countryList.map((option) => (
                <MenuItem key={option.code} value={option.name}>
                  {option.name} ({option.code})
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
              Submit
            </Button>
          </Stack>
        </Card>
      </form>
      {values.error !== null ? (
        values.error === true ? (
          <Alert severity="error" onClose={() => {setValues({...values, error: null})}}>
            An error has occured — Flight probably exists!
          </Alert>
        ) : (
          <Alert severity="success" onClose={() => {setValues({...values, error: null})}}>
            Success — Flight created successfully!
          </Alert>
        )
      ) : null}
    </Container>
  );
};

export default CreatePerson;
