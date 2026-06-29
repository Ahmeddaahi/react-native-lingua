const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../node_modules/@clerk/expo/dist/specs/NativeClerkModule.android.js"
);

if (fs.existsSync(filePath)) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const target = 'var NativeClerkModule_android_default = (0, expo.requireNativeModule)("ClerkExpo");';
    const replacement = `var NativeClerkModule_android_default;
try {
  NativeClerkModule_android_default = (0, expo.requireNativeModule)("ClerkExpo");
} catch (e) {
  NativeClerkModule_android_default = null;
}`;

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(filePath, content, "utf8");
      console.log("Successfully patched ClerkExpo native module for Expo Go compatibility.");
    } else if (content.includes("try {")) {
      console.log("ClerkExpo native module is already patched.");
    } else {
      console.log("Target string not found in NativeClerkModule.android.js. Skipping patch.");
    }
  } catch (err) {
    console.error("Failed to patch ClerkExpo native module:", err);
  }
} else {
  console.log("NativeClerkModule.android.js not found. Skipping patch.");
}
