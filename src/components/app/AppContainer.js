import { Container, Grid } from "@mui/material";
import Navbar from "../navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Newhire from "../newhire/Newhire";
import Employees from './../employees/Employees';
import Jobs from "../jobs/Jobs";


const AppContainer = () => {
    return (
        <Container sx={{backgroundColor: "white", height: "100vh", width: "100vw", paddingLeft: "0px"}}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="new-hire" element={<Newhire />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path=""  element={<Employees />} />
                </Routes>
            </BrowserRouter>
        </Container>
    );
};

export default AppContainer;