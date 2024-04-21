import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
import { config } from "./appwrite.confing";

const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

const { databaseId, projectId, videoCollectionId, endpoint, platform, userCollectionId } = config;

// Init your react-native SDK
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

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
    return await databases.createDocument(databaseId, userCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar: avatarUrl,
    });
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

    const currentUser = await databases.listDocuments(databaseId, userCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ]);
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
