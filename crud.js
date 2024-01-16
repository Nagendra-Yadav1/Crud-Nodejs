const db_connect = require("./mongodb");
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "content-Type": "text/html" })
    let url = req.url;

    if (url === "/get") {
        const main = async (error) => {
            if (error) {
                console.error(error)
                return;
            }
            else {
                try {
                    const resp = await db_connect();
                    const data = await resp.find().toArray();
                    const response = JSON.stringify(data, null, 4);
                    res.end(response);
                } catch (error) {
                    console.error(error);
                    res.writeHead(500, { "content-Type": "text/plain" });
                    res.end("Internal Server Error");
                    console.log("Internal Error")
                }
            }

        }
        main()
    }

    else if (url === "/post") {
        if (req.method === "POST") {
            let request_body = "";
            req.on('data', (chunk) => {
                request_body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const db = await db_connect();
                    const inserted_data = JSON.parse(request_body);
                    await db.insertOne(inserted_data);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end("Data inserted successfully");
                    console.log("data inserted succesfully")


                } catch (error) {
                    console.error(error);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                }
            });
        }
        else {
            res.end("go to Postman for insert new data")

        }
    }


    else if (url === "/delete") {
        if (req.method === "DELETE") {
            let request_body = "";
            req.on("data", (chunk) => {
                request_body += chunk.toString()
            })
            req.on("end", async () => {
                try {
                    let db = await db_connect()
                    const delete_data = JSON.parse(request_body);
                    await db.deleteOne(delete_data)
                    res.writeHead(200, { "content-Type": "text/html" });
                    res.end("data deleted successfully");
                    console.log("data deleted successfully")
                }
                catch (error) {
                    console.log(error)
                    res.writeHead(500, { "content-Type": "text/plain" });
                    res.end("Internal server error")

                }
            })

        }
        else {
            res.end("go to postman for delete data")
        }
    }

    else if (url === "/update") {
        if (req.method === "PUT") {
            let request_body = "";
            req.on("data", (chunk) => {
                request_body += chunk
            })
            req.on("end", async () => {
                try {
                    let db = await db_connect();
                    let update_data= JSON.parse(request_body)
                    delete update_data._id
                    let key = Object.keys(update_data);
                    let value = Object.values(update_data)
                    let name_value = value[0]
                    let name_key = key[0]
                    await db.updateOne({ [name_key]: name_value },
                        { $set: update_data})

                    res.writeHead(200, { "conttent_type": "text/html" });
                    res.end("data updated successfullt");
                    console.log("data updated successfully")

                }
                catch (error) {
                    console.log(error)
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Data updated unsuccessfully");
                }
            })

        }
        else {
            res.end("go to postman for update data")
        }
    }
})

server.listen(3000, () => {
    console.log("This is working 3000 port very well")
})