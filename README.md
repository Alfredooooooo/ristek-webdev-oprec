### Ristek MedSOS

##### Dibuat dengan Next.js dan Nest.js

##### Mengambil level 3 + Bonus (tanpa deployment server sehingga cuman client saja karena billing Railway ku sudah habis 😭😭😭😭)

1.  Copylah file .env.example pada root project di main

    -   [ ]     Isinya seharusnya berupa env untuk Next.js (client) dan env untuk Nest.js (server)
    -   [ ] Untuk client, buatlah file .env.local pada directory client, dan copy environment variable <strong>NEXT_PUBLIC_API_URL=http://localhost:8000</strong>
    -   [ ] Untuk server, buatlah file pada directory server yaitu .env dan copy beberapa variable pada .env.example yaitu <strong>DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES, PORT</strong>

2.  Setelah set up environment variable,

    -   [ ]     Lakukan command `cd client`, dan lakukan `yarn install` untuk meninstalasi node modules
    -   [ ] Selanjutnya lakukan command `cd ..` , lakukan `cd server` dan `jalani command npx prisma generate` dan `yarn install`

> Pastikan kamu punya yarn, jika tidak npm install juga oke

3.  Lalu sudah bisa dijalankan dengan:

    -   [ ] Pergi ke directory client lalu jalankan `yarn dev`
    -   [ ] Pergi ke directory server lalu jalankan `yarn start`

> Jika kamu menggunakan NPM, maka npm run dev untuk client dan npm start untuk server

4.  Selamat mencoba!

Fitur:

1. Login/Register dengan validation serta default bio (lorem ipsum 100 kata)
2. CRUD untuk postingan
3. Close friend
4. Bookmark Posts
5. Logout
6. Profile beserta ability untuk mengubah profile picture dan bio
