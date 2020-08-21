const proxyUrl = process.env.LOCAL_DMS_URL || 'https://aw-dms-demo.nw.r.appspot.com'
export default ({ config }) => {
    config.extra = {
        proxyUrl: proxyUrl,
    }
    return config
}