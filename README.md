# Steps to install

`npm install`

# Steps to generate 

1. `npm install`
2. Run the process to generate guide.xml on [epg-grabber](./epg-grabber)
3. Run the process to generate foxtel.xml on [tempest](./tempest)
4. When both `guide.xml` and `foxtel.xml` files are generated, go to the root of this repository and run `npm run merge`
5. Verify that the file `merged-guide.xml` is generated.