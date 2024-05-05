import { Account, Avatars, Client, Databases, Storage, ID, Query } from "react-native-appwrite";
import { config } from "./appwrite.confing";

const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

const {
  databaseId,
  projectId,
  videoCollectionId,
  endpoint,
  platform,
  userCollectionId,
  storageId,
} = config;

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

export async function signOut() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    return await account.get();
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
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
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
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

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);
    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100);
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("Something went wrong");

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  if (!file) throw new Error("No file provided");

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.filesize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createVideo(formData) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(formData.thumbnail, "image"),
      uploadFile(formData.video, "video"),
    ]);

    const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
      title: formData.title,
      prompt: formData.prompt,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      creator: formData.userId,
    });

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function bookmarkVideo(userId, videoId) {
  try {
    const video = await databases.getDocument(databaseId, videoCollectionId, videoId);
    if (!video) throw new Error("Video doesn't exists");

    return await databases.updateDocument(databaseId, videoCollectionId, videoId, {
      bookmarkedBy: [...video.bookmarkedBy, userId],
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function unBookmarkVideo(userId, videoId) {
  try {
    const video = await databases.getDocument(databaseId, videoCollectionId, videoId);
    if (!video) throw new Error("Video doesn't exists");

    return await databases.updateDocument(databaseId, videoCollectionId, videoId, {
      bookmarkedBy: video.bookmarkedBy.filter((user) => user.$id !== userId),
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function getBookmarkedPosts(userId) {
  // TODO: Use a better logic probable a solution will be in the future versions of appwrite
  try {
    const posts = await getAllPosts();
    return posts.filter((post) => post.bookmarkedBy.some((user) => user.$id === userId));
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteVideo(videoId, userId) {
  try {
    const post = await databases.getDocument(databaseId, videoCollectionId, videoId);
    if (!post) throw new Error("Something went wrong");
    if (post.creator.$id !== userId) throw new Error("Video doesn't belong to you");
    await databases.deleteDocument(databaseId, videoCollectionId, videoId);
  } catch (error) {
    throw new Error(error);
  }
}
