import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function VideoCard({ video }) {
  return (
    <Card
      sx={{
        width: { xs: "300px", sm: "305px", md: "305px" },
        height:"250px",
        boxShadow: "none",
        borderRadius: 3
      }}
    >
      <CardMedia
        image={
          "https://images.pexels.com/photos/14579361/pexels-photo-14579361.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load"
        }
        alt={"dmeo tilt"}
        sx={{ width: { xs: "100%", sm: "358px" }, height: 180 }}
      />

      <CardContent sx={{ backgroundColor: "#1E1E1E", height: "106px" }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
          Demo Video Title
        </Typography>

        <Typography variant="subtitle2" color="gray">
          Demo Creator Name
          <CheckCircleIcon
            sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
