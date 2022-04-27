import React from "react";
import {
  Button,
  Stack,
  Typography,
  Card,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerWithEmailAndPassword } from "../services/firebase";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const CreateDesk: React.FC = () => {
  const [values, setValues] = React.useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerWithEmailAndPassword(values.email, values.password);
  };

  return (
    <Container>
      <Typography
        variant="h3"
        sx={{
          maxWidth: 425,
          marginX: "auto",
          textAlign: "center",
          paddingBottom: 2,
        }}
      >
        Sign Up
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
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel htmlFor="outlined-email">Email</InputLabel>
              <OutlinedInput
                required={true}
                id="outlined-email"
                type={"email"}
                value={values.email}
                onChange={handleChange("email")}
                label="Email"
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                required={true}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
              Submit
            </Button>
          </Stack>
        </Card>
      </form>
    </Container>
  );
};

export default CreateDesk;
