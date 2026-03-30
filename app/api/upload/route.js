export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const className = formData.get("class"); // ✅ IMPORTANT

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "study-materials",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const fileUrl = uploadRes.secure_url;

    // ✅ SAVE (IMPORTANT FIX)
    const newMaterial = {
      title,
      class: String(className), // 🔥 FIX
      fileUrl,
      uploadedAt: new Date(),
    };

    // TODO: Save to DB (example below)
    await Material.create(newMaterial);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}