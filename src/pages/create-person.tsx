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
import useAuth from "../store/auth-store";
import countryList from "../data/countries.json";
import { createPersonOnBlockchain } from "../services/blockchain";

interface State {
  id: string;
  passportNumber: string;
  name: string;
  dateOfBirth: string;
  citizen: string;
  error: boolean | null;
}

const CreatePerson: React.FC = () => {
  const { user } = useAuth();
  const [values, setValues] = React.useState<State>({
    id: "",
    passportNumber: "",
    name: "",
    dateOfBirth: "",
    citizen: "",
    error: null,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPersonOnBlockchain(
      values.id,
      values.passportNumber,
      values.name,
      values.dateOfBirth,
      values.citizen
    )
      .then((e: any) => setValues({ ...values, error: false }))
      .catch((e: Error) => {
        setValues({ ...values, error: true });
        console.log("An error has ocured: ", e);
      });
  };
  if (user.role === "country") {
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
          Create a New Person
        </Typography>
        <form
          action="/"
          method="POST"
          onSubmit={(e) => {
            handleFormSubmit(e);
          }}
        >
          <Card variant="outlined" sx={{ maxWidth: 425, marginX: "auto", padding: 3 }}>
            <Stack spacing={2}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                label="ID (Numbers only)"
                required={true}
                value={values.id}
                onChange={handleChange("id")}
              />
              <TextField
                label="Passport Number"
                required={true}
                value={values.passportNumber}
                onChange={handleChange("passportNumber")}
              />
              <TextField
                label="Name"
                required={true}
                value={values.name}
                onChange={handleChange("name")}
              />
              <TextField
                required={true}
                id="date"
                label="Date of Birth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required={true}
                id="outlined-select-country"
                select
                label="Select Country of Citizenship"
                value={values.citizen}
                onChange={handleChange("citizen")}
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
            <Alert
              severity="error"
              onClose={() => {
                setValues({ ...values, error: null });
              }}
            >
              An error has occured — User probably exists!
            </Alert>
          ) : (
            <Alert
              severity="success"
              onClose={() => {
                setValues({ ...values, error: null });
              }}
            >
              Success — User created successfully!
            </Alert>
          )
        ) : null}
      </Container>
    );
  }
  return (
    <Container>
      <Typography>You are not authorized to make these changes!</Typography>
    </Container>
  );
};

export default CreatePerson;
