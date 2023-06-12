import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

export const POST = async (req, res) => {
  const { messageTitle, messageBody } = await req.json();

  console.log(messageTitle,messageBody);

  try {
    return new Response(JSON.stringify("Hello"),{status:200})
  } catch (err) {
    return new Response(`Failed to create a new prompt: ${err}`,{
        status:500
    })
  }
};
