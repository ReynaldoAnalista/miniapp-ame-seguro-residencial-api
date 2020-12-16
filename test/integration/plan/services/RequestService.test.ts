const axios = require('axios');
const nock = require('nock');

describe('RequestService', () => {
    it('teste de erro axios', async () => {
        nock('http://localhost:3000')
            .get('/')
            .reply(500, {})
        try {
            await axios.get('http://localhost:3000/')
        } catch(e) {
            console.log(e)
        }
    })
})