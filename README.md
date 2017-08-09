# Reverse HTTP Tunnel server

You can connect with [client](https://github.com/garmoshka-mo/reverse-http-tunnel-android) to this server and make HTTP port from client's local network to become public.

## Usage

* dev: `./run.sh`
* prod: `npm start`

* http://127.0.0.1:8080/?port=5858


## Snippets for debug

```
curl --form "data=@notbad.jpg" \
http://localhost:3000/binary
```

## License

Open sourced under the [MIT license](LICENSE.txt)