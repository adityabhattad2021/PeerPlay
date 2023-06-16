
export const POST = async (req, res) => {
  const { signer } = await req.json();
  console.log(signer);
  try {
    return new Response(JSON.stringify("Success"), {
      status:200,
    });
  } catch (err) {
    return new Response(`Failed to create a new prompt: ${err}`, {
      status: 500,
    });
  }
};
