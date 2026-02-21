// controllers/fileController.js
import prisma from "../utils/prisma.js";
import supabaseAdmin from "../utils/supabaseAdmin.js";
import asyncHandler from "../utils/asyncHandler.js";

// define the structure of data for the database, whilst also providing an upload link to the user for the actual bytes

export const createFileMetadata = asyncHandler(async (req, res) => {
  const { name, mimeType, size, folderId } = req.body;
  const userId = req.user.id; // From your Protect middleware

  // 1. If folderId is provided, verify ownership
  if (folderId) {
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, ownerId: userId },
    });
    if (!folder) {
      res.status(404);
      throw new Error("Target folder not found");
    }
  }

  // 2. Define a unique storage path: users/{userId}/{fileId}-{name}
  // This prevents collisions and organizes the bucket logically
  const storageKey = `users/${userId}/${Date.now()}-${name}`;

  // 3. Create record in DB
  const fileRecord = await prisma.file.create({
    data: {
      name,
      mimeType,
      size,
      storageKey, // the actual bytes ref
      ownerId: userId,
      folderId: folderId || null,
    },
  });

  // 4. Generate Signed Upload URL (valid for 60 seconds)
  const { data, error } = await supabaseAdmin.storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUploadUrl(storageKey);

  if (error) {
    // Optional: Delete DB record if storage fails to provide a URL
    await prisma.file.delete({ where: { id: fileRecord.id } });
    res.status(500);
    throw new Error(`Storage Error: ${error.message}`);
  }

  res.status(201).json({
    file: fileRecord,
    upload: {
      signedUrl: data.signedUrl,
      path: storageKey,
      token: data.token, // Required by some Supabase SDK versions for the PUT request
    },
  });
});

export const getDownloadUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // 1. Find file and verify ownership
  const file = await prisma.file.findFirst({
    where: { id, ownerId: userId },
  });

  if (!file) {
    res.status(404);
    throw new Error("File not found or unauthorized");
  }

  // 2. Generate Signed Download URL (valid for 60 seconds)
  const { data, error } = await supabaseAdmin.storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUrl(file.storageKey, 60);

  if (error) {
    res.status(500);
    throw new Error(`Storage Error: ${error.message}`);
  }

  res.status(200).json({
    signedUrl: data.signedUrl,
    expiresIn: 60,
  });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // 1. Find the file to get the storageKey and verify ownership
  const file = await prisma.file.findFirst({
    where: { id, ownerId: userId },
  });

  if (!file) {
    res.status(404);
    throw new Error("File not found or unauthorized");
  }

  // 2. Delete from Supabase Storage first
  // We pass an array of keys to .remove()
  const { error: storageError } = await supabaseAdmin.storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([file.storageKey]);

  if (storageError) {
    res.status(500);
    throw new Error(`Cloud Storage Error: ${storageError.message}`);
  }

  // 3. Delete from Prisma Database
  await prisma.file.delete({
    where: { id },
  });

  res
    .status(200)
    .json({ message: "File and cloud storage entry deleted successfully" });
});

export const updateFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, folderId } = req.body;
  const userId = req.user.id;

  const file = await prisma.file.findFirst({
    where: { id, ownerId: userId },
  });

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  const updatedFile = await prisma.file.update({
    where: { id },
    data: {
      name: name || file.name,
      folderId: folderId !== undefined ? folderId : file.folderId,
    },
  });

  res.status(200).json(updatedFile);
});
