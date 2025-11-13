import Cloudflare from "cloudflare"

const client = new Cloudflare({apiToken: process.env.CF_API})

export default client