import * as PushAPI from "@pushprotocol/restapi";

export async function createUserIfNecessary(options) {
  let { account, signer, env = "staging" } = options || {};

  let connectedUser = await PushAPI.user.get({ account: account, env });

  if (!connectedUser?.encryptedPrivateKey) {
    connectedUser = await PushAPI.user.create({
      account: account,
      signer: signer,
      env,
    });
  }
  const decryptedPrivateKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: connectedUser.encryptedPrivateKey,
    account,
    signer,
    env,
  });
  return { ...connectedUser, privateKey: decryptedPrivateKey };
}

export async function getChats(options) {
  let {
    account,
    pgpPrivateKey,
    creatorAddress,
    threadHash = null,
    limit = 20,
    env = "staging",
  } = options || {};
  if (!threadHash) {
    threadHash = await PushAPI.chat.conversationHash({
      account: account,
      conversationId: creatorAddress,
      env: env,
    });
    threadHash = threadHash.threadHash;
    console.log("threadHash ",threadHash);
  }
  if (threadHash) {
    const chats = await PushAPI.chat.history({
      account: account,
      pgpPrivateKey: pgpPrivateKey,
      threadhash: threadHash,
      toDecrypt: true,
      limit: limit,
      env: env,
    });
    const lastThreadHash = chats[chats.length - 1]?.link;
    const lastListPresent = chats.length > 0 ? true : false;
    return { chatsResponse: chats, lastThreadHash, lastListPresent };
  }
  return { chatsResponse: [], lastThreadHash: null, lastListPresent: false };
}

export async function decryptChat(options) {
  const { message, connectedUser, env = Constants.ENV.PROD } = options || {};
  const decryptedChat = await PushAPI.chat.decryptConversation({
    messages: [message],
    connectedUser,
    pgpPrivateKey: connectedUser.privateKey,
    env,
  });
  return decryptedChat[0];
}
