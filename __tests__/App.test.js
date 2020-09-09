const request = require('supertest')
import { connectDms } from '../AwClient'
import axios from 'axios';



jest.mock('axios');

describe('AwClient', () => {
    it('connects to dms to get user info', async () => {
        const deviceId = 'DE:6C:5D:45:11:DD'
        const proxyServer = 'https://aw-dms-demo.nw.r.appspot.com'
        const resp = {username: 'Dev'}
        axios.get.mockResolvedValue(resp)

        return connectDms(proxyServer, deviceId ).then(data => expect(data).toEqual(deviceId));

        // const userInfo = await connectDms(proxyServer, deviceId)

    });
});