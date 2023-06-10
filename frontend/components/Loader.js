import {Box, CircularProgress,Stack } from "@mui/material";


export default function Loader() {
    return (
        <Box minHeight="95vh">
            <Stack direction="row" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress color="primary" />
            </Stack>
        </Box>
    )
}