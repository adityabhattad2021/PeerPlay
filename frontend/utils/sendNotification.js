import axios from "axios";

async function sendNotificationPush(data) {
  try {
    const response = await axios.post("/api/send-notification", data);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}


export default sendNotificationPush;