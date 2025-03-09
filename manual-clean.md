# Manual Cache Cleaning Steps

If the automated script doesn't work, you can manually clean the Next.js cache with these steps:

1. Stop any running Next.js processes

2. Delete the following directories:
   - `.next` folder (Next.js build output)
   - `node_modules/.cache` folder (Webpack/Babel cache)

3. On Windows, use these commands in PowerShell:
   ```powershell
   Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue

