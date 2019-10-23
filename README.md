# Resident Visor Generator

A utility app for generating [Resident Visors](https://instagram.com/residentvisor)

## Tech Details

Feel free to use ES6 code. Uses Webpack+Babel to build front-end and Babel to build the backend.

Front-end wizard is written in JSX with React. Backend uses the [Printful](https://www.printful.com)
Mockup Generator API and imagemagick.

See Printful Mockup Generator API [here](https://www.printful.com/docs/generator).

You need to have a Printful API key as env variable `PRINTFUL_API_KEY`

### Limitations

The mockup generator API only allows 10 requests every 60 seconds, and locks you out after 60
seconds when you exceed that, so cool it on the requests.

Could possibly get around this by using a queue, but this isn't meant for public consumption for now,
so get to that later.

## TODO:

- Probably better if I used React Router