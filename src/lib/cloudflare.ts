import Cloudflare from "cloudflare"

const client = new Cloudflare({apiKey: process.env.CF_API ? process.env.CF_API : ""})

export default client