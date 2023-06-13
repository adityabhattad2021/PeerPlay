import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

export const POST = async (req, res) => {
  const { messageTitle, messageBody } = await req.json();

  const PK = process.env.PUSH_PROTOCOL_CHANNEL_CREATOR_PRIVATE_KEY;
  const Pkey = `0x${PK}`;
  const PA = process.env.PUSH_PROTOCOL_CHANNEL_CREATOR_ADDRESS;
  const _signer = new ethers.Wallet(Pkey);

  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: messageTitle,
        body: messageBody,
      },
      payload: {
        title: messageTitle,
        body: messageBody,
        cta: "Check out Peerplay now!",
        img: "",
      },
      channel: `eip155:5:${PA}`, // your channel address
      env: "staging",
    });
    console.log(apiResponse.status);
    return new Response(JSON.stringify("Success"), {
      status: apiResponse.status,
    });
  } catch (err) {
    return new Response(`Failed to create a new prompt: ${err}`, {
      status: 500,
    });
  }
};
