import { ID, Account, Client, Avatars, Databases, Query } from "react-native-appwrite";
import { config } from "./appwrite.confing";

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Init your react-native SDK
client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform);

export async function createUser(username, email, password) {
  try {
    // Try to create a new account
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw Error;

    // Generate avatar
    const avatarUrl = avatars.getInitials(username);

    // Sign in the new account
    await signIn(email, password);

    // Create a new user document and return it
    return await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    );
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
   return await account.createEmailSession(email, password);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ]);
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
